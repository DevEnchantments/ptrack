import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, Check, Loader2, Pencil, Plus, X } from 'lucide-react'
import {
  adminLookupsApi,
  lookupsApi,
  type AdminLookupRow,
  type AdminLookupTable,
} from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ACCESS_LEVELS = [
  { label: 'Read only', value: 'read_only' },
  { label: 'Read / write', value: 'read_write' },
  { label: 'Read / write / admin', value: 'read_write_admin' },
]

function labelFor(key: string): string {
  return key
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

function ValueRow({
  tableKey,
  row,
  extras,
  first,
  last,
  onChanged,
  onMove,
}: {
  tableKey: string
  row: AdminLookupRow
  extras: string[]
  first: boolean
  last: boolean
  onChanged: () => void
  onMove: (row: AdminLookupRow, dir: -1 | 1) => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(row.name)
  const [saving, setSaving] = useState(false)

  async function patch(body: Parameters<typeof adminLookupsApi.update>[2]) {
    setSaving(true)
    try {
      await adminLookupsApi.update(tableKey, row.id, body)
      lookupsApi.invalidate(tableKey)
      onChanged()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function saveName() {
    const clean = name.trim()
    if (!clean || clean === row.name) {
      setEditing(false)
      setName(row.name)
      return
    }
    await patch({ name: clean })
    setEditing(false)
  }

  return (
    <li
      className={`flex flex-wrap items-center gap-2 px-4 py-2 ${row.is_active ? '' : 'opacity-50'}`}
    >
      <div className="flex flex-col">
        <button
          type="button"
          aria-label="Move up"
          disabled={first || saving}
          onClick={() => onMove(row, -1)}
          className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Move down"
          disabled={last || saving}
          onClick={() => onMove(row, 1)}
          className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {editing ? (
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Input
            autoFocus
            className="h-8"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void saveName()
              if (e.key === 'Escape') {
                setEditing(false)
                setName(row.name)
              }
            }}
          />
          <Button size="sm" variant="ghost" onClick={saveName} disabled={saving} aria-label="Save name">
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Cancel rename"
            onClick={() => {
              setEditing(false)
              setName(row.name)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
          onClick={() => setEditing(true)}
        >
          <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{row.name}</span>
        </button>
      )}

      {extras.includes('color') && (
        <span className="flex items-center gap-1.5">
          <span
            className="h-4 w-4 rounded-full border"
            style={row.color ? { background: row.color } : undefined}
          />
          <Input
            className="h-8 w-24 text-xs"
            placeholder="#hex"
            defaultValue={row.color ?? ''}
            onBlur={(e) => {
              const v = e.target.value.trim()
              if (v !== (row.color ?? '')) void patch({ color: v || null })
            }}
          />
        </span>
      )}

      {extras.includes('rank') && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Rank
          <Input
            type="number"
            className="h-8 w-16"
            defaultValue={row.rank ?? 0}
            onBlur={(e) => {
              const v = Number(e.target.value)
              if (Number.isInteger(v) && v !== (row.rank ?? 0))
                void patch({ rank: v })
            }}
          />
        </span>
      )}

      {extras.includes('default_access_level') && (
        <Select
          items={ACCESS_LEVELS}
          value={row.default_access_level ?? 'read_only'}
          onValueChange={(v) => {
            if (v && v !== row.default_access_level)
              void patch({ default_access_level: v })
          }}
        >
          <SelectTrigger className="h-8 w-44 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACCESS_LEVELS.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
        <input
          type="checkbox"
          className="h-4 w-4 accent-primary"
          checked={row.is_active}
          disabled={saving}
          onChange={(e) => void patch({ is_active: e.target.checked })}
        />
        Active
      </label>

      {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </li>
  )
}

/** Code Table Administration: create, rename, reorder, activate/deactivate
 *  values in every lookup table. No hard delete — values may be referenced by
 *  records; deactivating removes them from dropdowns while history keeps
 *  rendering. Access gating arrives with the security phase (ASSUMED open to
 *  all signed-in users until then). */
export function CodeTablesPage() {
  usePageTitle('Code Tables')

  const [tables, setTables] = useState<Record<string, AdminLookupTable> | null>(null)
  const [selected, setSelected] = useState('project-statuses')
  const [error, setError] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const load = useCallback(() => {
    adminLookupsApi
      .listAll()
      .then((data) => {
        setTables(data)
        setError(null)
      })
      .catch((e) => setError((e as Error).message))
  }, [])

  useEffect(load, [load])

  const current = tables?.[selected]

  async function add() {
    const clean = newName.trim()
    if (!clean || !current) return
    setAdding(true)
    try {
      const maxSort = Math.max(0, ...current.rows.map((r) => r.sort_order ?? 0))
      await adminLookupsApi.add(selected, { name: clean, sort_order: maxSort + 1 })
      lookupsApi.invalidate(selected)
      setNewName('')
      toast.success('Value added.')
      load()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setAdding(false)
    }
  }

  // Reorder = renumber 1..n around the swap, patching only rows whose
  // sort_order actually changes (also heals null/duplicate sort values).
  async function move(row: AdminLookupRow, dir: -1 | 1) {
    if (!current) return
    const rows = [...current.rows]
    const i = rows.findIndex((r) => r.id === row.id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= rows.length) return
    ;[rows[i], rows[j]] = [rows[j], rows[i]]
    try {
      for (let k = 0; k < rows.length; k++) {
        if (rows[k].sort_order !== k + 1) {
          await adminLookupsApi.update(selected, rows[k].id, { sort_order: k + 1 })
        }
      }
      lookupsApi.invalidate(selected)
      load()
    } catch (e) {
      toast.error((e as Error).message)
      load()
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Administration
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Code Tables</h1>
        <Link
          to="/admin/users-roles"
          className="text-sm text-muted-foreground hover:underline"
        >
          Users &amp; Roles →
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        The configurable value lists behind every dropdown. Deactivated values
        disappear from pickers; existing records keep showing them.
      </p>

      {error ? (
        <p className="mt-6 text-sm font-medium text-destructive">
          Could not load code tables: {error}
        </p>
      ) : !tables ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {[0, 1].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <nav className="self-start rounded-lg border bg-card p-2">
            <ul className="flex flex-col">
              {Object.keys(tables)
                .sort()
                .map((key) => (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => setSelected(key)}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                        key === selected
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span className="truncate">{labelFor(key)}</span>
                      <span
                        className={`ml-2 shrink-0 text-xs ${key === selected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
                      >
                        {tables[key].rows.length}
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </nav>

          <section className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{labelFor(selected)}</h2>
              <div className="flex items-center gap-2">
                <Input
                  className="h-9 w-56"
                  placeholder="New value name…"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void add()
                  }}
                />
                <Button size="sm" onClick={add} disabled={adding || !newName.trim()}>
                  {adding ? <Loader2 className="animate-spin" /> : <Plus />}
                  Add
                </Button>
              </div>
            </div>

            {current && current.rows.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No values yet. Add the first one above.
              </p>
            ) : (
              <ul className="mt-4 divide-y rounded-md border bg-card">
                {current?.rows.map((row, i) => (
                  <ValueRow
                    key={row.id}
                    tableKey={selected}
                    row={row}
                    extras={current.extras}
                    first={i === 0}
                    last={i === current.rows.length - 1}
                    onChanged={load}
                    onMove={move}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
