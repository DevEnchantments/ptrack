import type { ProjectListItem } from '@/lib/api'

export type GridSortKey =
  | 'name'
  | 'tier'
  | 'owner'
  | 'manager'
  | 'sector'
  | 'end'
  | 'manual'
  | 'calculated'
  | 'at_risk'
  | 'status'

export interface GridSort {
  key: GridSortKey
  dir: 'asc' | 'desc'
}

export function gridSortValue(
  p: ProjectListItem,
  key: GridSortKey,
): string | number | null {
  switch (key) {
    case 'name':
      return p.name.toLowerCase()
    case 'tier':
      return p.tier?.name ?? null
    case 'owner':
      return p.owner?.full_name ?? p.owner?.email ?? null
    case 'manager':
      return p.project_manager?.full_name ?? p.project_manager?.email ?? null
    case 'sector':
      return p.sector?.name ?? null
    case 'end':
      return p.target_end_date
    case 'manual':
      return p.manual_progress
    case 'calculated':
      return p.calculated_progress
    case 'at_risk':
      return p.at_risk ? 1 : 0
    case 'status':
      return p.status?.name ?? null
  }
}
