import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Check, ChevronLeft, Loader2, Upload, X } from 'lucide-react'
import {
  importApi,
  lookupsApi,
  projectsApi,
  type ImportSummary,
} from '@/lib/api'
import { parseCsv } from '@/lib/csv'
import { usePageTitle } from '@/lib/use-page-title'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FieldDef {
  key: string
  label: string
  required?: boolean
  kind?: 'date' | 'number' | 'lookup' | 'project'
  lookup?: string
}

const PROJECT_FIELDS: FieldDef[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'description', label: 'Description' },
  { key: 'sponsor', label: 'Sponsor' },
  { key: 'status', label: 'Status', kind: 'lookup', lookup: 'project-statuses' },
  { key: 'sector', label: 'Sector', kind: 'lookup', lookup: 'sectors' },
  { key: 'category', label: 'Category', kind: 'lookup', lookup: 'project-categories' },
  { key: 'type', label: 'Type', kind: 'lookup', lookup: 'deal-types' },
  { key: 'tier', label: 'Tier', kind: 'lookup', lookup: 'tiers' },
  { key: 'plan_year', label: 'Plan Year', kind: 'number' },
  { key: 'start_date', label: 'Start Date', kind: 'date' },
  { key: 'target_end_date', label: 'Target End Date', kind: 'date' },
  { key: 'approved_budget', label: 'Approved Budget', kind: 'number' },
  { key: 'utilized_budget', label: 'Utilized Budget', kind: 'number' },
  { key: 'reference_id', label: 'Reference ID' },
  { key: 'project_number', label: 'Project Number' },
  { key: 'tags', label: 'Tags (; separated)' },
]

const MILESTONE_FIELDS: FieldDef[] = [
  { key: 'project', label: 'Project (name)', required: true, kind: 'project' },
  { key: 'name', label: 'Name', required: true },
  { key: 'description', label: 'Description' },
  { key: 'start_date', label: 'Start Date', kind: 'date' },
  { key: 'due_date', label: 'Due Date', kind: 'date' },
  { key: 'weightage', label: 'Weight', kind: 'number' },
  { key: 'is_major', label: 'Major (yes/no)' },
  { key: 'status', label: 'Status (open/completed/n·a)' },
]

const IGNORE = '__ignore__'

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

const validDate = (v: string) =>
  v.trim() === '' ||
  /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ||
  /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v.trim())

const validNumber = (v: string) =>
  v.trim() === '' || Number.isFinite(Number(v.trim().replace(/[, ]/g, '')))

interface RowCheck {
  errors: string[]
  warnings: string[]
}

/** Bulk data load: CSV in, preview with validation, create-only commit
 *  through the import API (server re-validates everything). */
export function ImportPage() {
  usePageTitle('Import')
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [entity, setEntity] = useState<'projects' | 'milestones'>('projects')
  const [grid, setGrid] = useState<string[][]>([])
  const [mapping, setMapping] = useState<Record<number, string>>({})
  const [lookupNames, setLookupNames] = useState<Record<string, Set<string>>>({})
  const [existingNames, setExistingNames] = useState<Set<string>>(new Set())
  const [committing, setCommitting] = useState(false)
  const [summary, setSummary] = useState<ImportSummary | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [pasted, setPasted] = useState('')

  const fields = entity === 'projects' ? PROJECT_FIELDS : MILESTONE_FIELDS
  const headers = grid[0] ?? []
  const dataRows = useMemo(() => grid.slice(1), [grid])

  function loadCsv(text: string) {
    const parsed = parseCsv(text)
    if (parsed.length < 2) {
      toast.error('The CSV needs a header row plus at least one data row.')
      return
    }
    if (parsed.length - 1 > 500) {
      toast.error('At most 500 rows per import.')
      return
    }
    // Auto-map headers to fields by normalized name.
    const map: Record<number, string> = {}
    parsed[0].forEach((h, i) => {
      const hit = fields.find(
        (f) => normalize(f.key) === normalize(h) || normalize(f.label) === normalize(h),
      )
      map[i] = hit ? hit.key : IGNORE
    })
    setGrid(parsed)
    setMapping(map)
    setStep(2)

    // Reference data for preview warnings (best-effort).
    const lookups = fields.filter((f) => f.lookup)
    Promise.all(lookups.map((f) => lookupsApi.list(f.lookup as string)))
      .then((lists) => {
        const named: Record<string, Set<string>> = {}
        lookups.forEach((f, i) => {
          named[f.key] = new Set(lists[i].map((l) => l.name.trim().toLowerCase()))
        })
        setLookupNames(named)
      })
      .catch(() => setLookupNames({}))
    projectsApi
      .list()
      .then((p) => setExistingNames(new Set(p.map((x) => x.name.trim().toLowerCase()))))
      .catch(() => setExistingNames(new Set()))
  }

  function onFile(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => loadCsv(String(reader.result ?? ''))
    reader.readAsText(file)
  }

  const mappedKeys = Object.values(mapping).filter((k) => k !== IGNORE)
  const missingRequired = fields.filter((f) => f.required && !mappedKeys.includes(f.key))

  function rowRecord(row: string[]): Record<string, string> {
    const rec: Record<string, string> = {}
    headers.forEach((_, i) => {
      const key = mapping[i]
      if (key && key !== IGNORE && (row[i] ?? '').trim() !== '') rec[key] = row[i]
    })
    return rec
  }

  const checks: RowCheck[] = useMemo(
    () =>
      dataRows.map((row) => {
        const rec = rowRecord(row)
        const errors: string[] = []
        const warnings: string[] = []
        for (const f of fields) {
          const v = rec[f.key] ?? ''
          if (f.required && v.trim() === '') errors.push(`${f.label} is required`)
          if (f.kind === 'date' && !validDate(v)) errors.push(`bad date in ${f.label}`)
          if (f.kind === 'number' && !validNumber(v)) errors.push(`bad number in ${f.label}`)
          if (f.kind === 'project' && v.trim() && !existingNames.has(v.trim().toLowerCase()))
            errors.push(`unknown project "${v.trim()}"`)
          if (f.kind === 'lookup' && v.trim()) {
            const known = lookupNames[f.key]
            if (known && !known.has(v.trim().toLowerCase()))
              warnings.push(`"${v.trim()}" is not a ${f.label} value — will be left empty`)
          }
        }
        if (entity === 'projects' && (rec.name ?? '').trim() && existingNames.has(rec.name.trim().toLowerCase()))
          warnings.push('a project with this name already exists — will import anyway')
        return { errors, warnings }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataRows, mapping, lookupNames, existingNames, entity],
  )

  const importable = dataRows.filter((_, i) => checks[i]?.errors.length === 0)

  async function commit() {
    setCommitting(true)
    try {
      const rows = importable.map((r) => rowRecord(r))
      const result =
        entity === 'projects'
          ? await importApi.projects(rows)
          : await importApi.milestones(rows)
      setSummary(result)
      setStep(4)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setCommitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Data Load
      </p>
      <h1 className="text-2xl font-semibold">Import from CSV</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload, map the columns, review the preview, then commit. Nothing is
        written until the final step; existing records are never modified.
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        {['Upload', 'Map columns', 'Preview', 'Results'].map((label, i) => (
          <span key={label} className="flex items-center gap-2">
            {i > 0 && <span>›</span>}
            <span
              className={`rounded-full px-2.5 py-0.5 ${
                step === i + 1
                  ? 'bg-primary text-primary-foreground'
                  : 'border bg-card'
              }`}
            >
              {label}
            </span>
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="mt-6 flex flex-col gap-4 rounded-lg border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">What are you importing?</span>
            <div className="flex items-center gap-1 rounded-md border p-0.5">
              {(
                [
                  ['projects', 'Projects'],
                  ['milestones', 'Milestones'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEntity(value)}
                  className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    entity === value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button onClick={() => fileRef.current?.click()}>
              <Upload />
              Choose CSV file
            </Button>
            <span className="text-xs text-muted-foreground">
              or paste CSV below (max 500 rows)
            </span>
          </div>

          <Textarea
            rows={6}
            placeholder={
              entity === 'projects'
                ? 'name,status,start_date,target_end_date\nMy Project,In Progress,2026-09-01,2027-03-31'
                : 'project,name,due_date,weightage\nMy Project,Kickoff complete,2026-10-01,25'
            }
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
          />
          <div>
            <Button
              variant="outline"
              disabled={!pasted.trim()}
              onClick={() => loadCsv(pasted)}
            >
              Use pasted CSV
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium">
              Map each CSV column to a field ({dataRows.length} data rows)
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {headers.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-40 shrink-0 truncate text-sm" title={h}>
                    {h || `(column ${i + 1})`}
                  </span>
                  <Select
                    items={[
                      { label: '- Ignore -', value: IGNORE },
                      ...fields.map((f) => ({ label: f.label, value: f.key })),
                    ]}
                    value={mapping[i] ?? IGNORE}
                    onValueChange={(v) =>
                      setMapping((cur) => ({ ...cur, [i]: v ?? IGNORE }))
                    }
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={IGNORE}>- Ignore -</SelectItem>
                      {fields.map((f) => (
                        <SelectItem key={f.key} value={f.key}>
                          {f.label}
                          {f.required ? ' *' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            {missingRequired.length > 0 && (
              <p className="mt-3 text-sm font-medium text-destructive">
                Required fields not mapped:{' '}
                {missingRequired.map((f) => f.label).join(', ')}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft />
              Back
            </Button>
            <Button disabled={missingRequired.length > 0} onClick={() => setStep(3)}>
              Preview
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium">
              {importable.length} of {dataRows.length} row
              {dataRows.length === 1 ? '' : 's'} will import
              {dataRows.length - importable.length > 0 &&
                `; ${dataRows.length - importable.length} skipped for errors`}
              . Nothing has been written yet.
            </p>
            <div className="mt-3 max-h-96 overflow-y-auto">
              <ul className="flex flex-col divide-y rounded-md border">
                {dataRows.map((row, i) => {
                  const check = checks[i] ?? { errors: [], warnings: [] }
                  const rec = rowRecord(row)
                  const label =
                    rec.name || rec.project || `(row ${i + 2})`
                  return (
                    <li key={i} className="flex items-start gap-3 px-3 py-2">
                      {check.errors.length > 0 ? (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      ) : check.warnings.length > 0 ? (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-amber-fg)]" />
                      ) : (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-green-fg)]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {label}
                        </span>
                        {[...check.errors, ...check.warnings].map((msg, k) => (
                          <span
                            key={k}
                            className={`block text-xs ${
                              k < check.errors.length
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {msg}
                          </span>
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)} disabled={committing}>
              <ChevronLeft />
              Back
            </Button>
            <Button onClick={commit} disabled={committing || importable.length === 0}>
              {committing && <Loader2 className="animate-spin" />}
              {committing
                ? 'Importing…'
                : `Import ${importable.length} row${importable.length === 1 ? '' : 's'}`}
            </Button>
          </div>
        </div>
      )}

      {step === 4 && summary && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium">
              Created {summary.created}; failed {summary.failed}.
            </p>
            {summary.failed > 0 && (
              <ul className="mt-3 flex flex-col gap-1">
                {summary.results
                  .filter((r) => r.status === 'failed')
                  .map((r) => (
                    <li key={r.row} className="text-xs text-destructive">
                      Row {r.row} ({r.name}): {r.error}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setStep(1)
                setGrid([])
                setPasted('')
                setSummary(null)
              }}
            >
              Import more
            </Button>
            <Button onClick={() => navigate('/')}>Go to Projects</Button>
          </div>
        </div>
      )}
    </div>
  )
}
