import { ChevronDown, ChevronUp, Star, TriangleAlert } from 'lucide-react'
import { StatusPill } from '@/components/StatusPill'
import type { ProjectListItem } from '@/lib/api'
import { gridSortValue, type GridSort, type GridSortKey } from '@/lib/project-grid'

const COLUMNS: Array<{ key: GridSortKey; label: string; numeric?: boolean }> = [
  { key: 'name', label: 'Project' },
  { key: 'status', label: 'Status' },
  { key: 'tier', label: 'Tier' },
  { key: 'owner', label: 'Owner' },
  { key: 'manager', label: 'Manager' },
  { key: 'sector', label: 'Sector' },
  { key: 'end', label: 'End Date' },
  { key: 'manual', label: 'Manual', numeric: true },
  { key: 'calculated', label: 'Calculated', numeric: true },
  { key: 'at_risk', label: 'At Risk' },
]

/** FR-01 register grid (Fig 1 columns), sortable, row-per-project. */
export function ProjectsGrid({
  projects,
  sort,
  onSort,
  onOpen,
}: {
  projects: ProjectListItem[]
  sort: GridSort
  onSort: (key: GridSortKey) => void
  onOpen: (id: string) => void
}) {
  const sorted = [...projects].sort((x, y) => {
    const a = gridSortValue(x, sort.key)
    const b = gridSortValue(y, sort.key)
    if (a == null && b == null) return 0
    if (a == null) return 1
    if (b == null) return -1
    const cmp = a < b ? -1 : a > b ? 1 : 0
    return sort.dir === 'asc' ? cmp : -cmp
  })
  return (
    <div className="overflow-x-auto rounded-lg border bg-card shadow-xs">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            {COLUMNS.map((c) => (
              <th key={c.key} className="px-3 py-2 font-medium">
                <button
                  type="button"
                  onClick={() => onSort(c.key)}
                  className={`flex items-center gap-1 transition-colors hover:text-foreground ${
                    c.numeric ? 'ml-auto' : ''
                  }`}
                >
                  {c.label}
                  {sort.key === c.key &&
                    (sort.dir === 'asc' ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    ))}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {sorted.map((p) => (
            <tr
              key={p.id}
              role="link"
              tabIndex={0}
              onClick={() => onOpen(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onOpen(p.id)
              }}
              className="cursor-pointer transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            >
              <td className="px-3 py-2.5 font-medium">
                <span className="flex items-center gap-1.5">
                  {p.is_priority && (
                    <Star className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" />
                  )}
                  {p.name}
                </span>
              </td>
              <td className="px-3 py-2.5">
                {p.status?.name ? <StatusPill status={p.status.name} /> : '-'}
              </td>
              <td className="px-3 py-2.5">{p.tier?.name ?? '-'}</td>
              <td className="px-3 py-2.5">
                {p.owner?.full_name ?? p.owner?.email ?? '-'}
              </td>
              <td className="px-3 py-2.5">
                {p.project_manager?.full_name ??
                  p.project_manager?.email ??
                  '-'}
              </td>
              <td className="px-3 py-2.5">{p.sector?.name ?? '-'}</td>
              <td className="px-3 py-2.5">{p.target_end_date ?? '-'}</td>
              <td className="px-3 py-2.5 text-right">
                {p.manual_progress != null ? `${p.manual_progress}%` : '-'}
              </td>
              <td className="px-3 py-2.5 text-right">
                {p.calculated_progress != null
                  ? `${p.calculated_progress}%`
                  : '-'}
              </td>
              <td className="px-3 py-2.5">
                {p.at_risk ? (
                  <TriangleAlert
                    aria-label="At risk"
                    className="h-4 w-4 text-destructive"
                  />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
