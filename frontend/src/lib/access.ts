import type { Me, ProjectDetail } from '@/lib/api'

/**
 * Frontend mirror of the backend's project access resolution
 * (backend/src/common/access/access.logic.ts) — mirrored by design, like
 * formulas.ts. Used only to hide affordances; the backend enforces.
 */
export const AccessLevel = {
  None: 0,
  View: 1,
  Write: 2,
  Manage: 3,
} as const
export type AccessLevelValue = (typeof AccessLevel)[keyof typeof AccessLevel]

const MEMBERSHIP_LEVEL: Record<string, number> = {
  read_only: AccessLevel.View,
  read_write: AccessLevel.Write,
  read_write_admin: AccessLevel.Manage,
}

export function projectAccessLevel(
  me: Me | null,
  project: ProjectDetail,
): number {
  if (!me) return AccessLevel.View // unknown yet — backend still enforces
  if (me.app_role === 'admin' || me.app_role === 'pmo') return AccessLevel.Manage

  let level: number =
    project.access_control === 'restricted' ? AccessLevel.None : AccessLevel.View

  const membership = project.members.find(
    (m) => m.user_id === me.id && m.status === 'active',
  )
  if (membership) {
    level = Math.max(
      level,
      MEMBERSHIP_LEVEL[membership.access_level] ?? AccessLevel.View,
    )
  }
  if (
    me.id === project.project_manager_id ||
    me.id === project.project_manager2_id ||
    me.id === project.pmo_partner_id
  ) {
    level = Math.max(level, AccessLevel.Write)
  }
  if (me.id === project.owner_id) level = AccessLevel.Manage

  return level
}
