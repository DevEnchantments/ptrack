import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ProjectListItem } from '@/lib/api'
import { StatusPill } from '@/components/StatusPill'

interface Props {
  projects: ProjectListItem[]
}

interface TreeRow {
  project: ProjectListItem
  depth: number
  hasChildren: boolean
}

/** Register tree mode: parent → child project nesting from
 *  `parent_project_id`. A child whose parent is filtered out surfaces at
 *  root level; a visited-set guards against cyclic parent data. */
export function ProjectTree({ projects }: Props) {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const present = new Set(projects.map((p) => p.id))
  const childrenOf = new Map<string, ProjectListItem[]>()
  const roots: ProjectListItem[] = []
  for (const p of projects) {
    if (p.parent_project_id && present.has(p.parent_project_id)) {
      const arr = childrenOf.get(p.parent_project_id) ?? []
      arr.push(p)
      childrenOf.set(p.parent_project_id, arr)
    } else {
      roots.push(p)
    }
  }

  const rows: TreeRow[] = []
  const visited = new Set<string>()
  function walk(p: ProjectListItem, depth: number) {
    if (visited.has(p.id)) return
    visited.add(p.id)
    const kids = childrenOf.get(p.id) ?? []
    rows.push({ project: p, depth, hasChildren: kids.length > 0 })
    if (!collapsed.has(p.id)) for (const kid of kids) walk(kid, depth + 1)
  }
  for (const root of roots) walk(root, 0)

  function toggle(id: string) {
    setCollapsed((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <ul className="section-list divide-y rounded-md border bg-card">
      {rows.map(({ project: p, depth, hasChildren }) => (
        <li
          key={p.id}
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ paddingLeft: 16 + depth * 28 }}
        >
          {hasChildren ? (
            <button
              type="button"
              aria-label={collapsed.has(p.id) ? 'Expand' : 'Collapse'}
              aria-expanded={!collapsed.has(p.id)}
              onClick={() => toggle(p.id)}
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              {collapsed.has(p.id) ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="h-4 w-4 shrink-0" />
          )}
          <button
            type="button"
            onClick={() => navigate(`/projects/${p.id}`)}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="truncate text-sm font-medium hover:text-primary">
              {p.name}
            </span>
            {hasChildren && (
              <span className="shrink-0 text-xs text-muted-foreground">
                {(childrenOf.get(p.id) ?? []).length} sub-project
                {(childrenOf.get(p.id) ?? []).length === 1 ? '' : 's'}
              </span>
            )}
          </button>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {p.calculated_progress ?? 0}%
          </span>
          {p.status?.name && <StatusPill status={p.status.name} />}
        </li>
      ))}
    </ul>
  )
}
