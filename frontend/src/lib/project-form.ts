import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'

export const NEW_SECTOR = '__new_sector__'

export function emptyMember(): ProjectMemberInput {
  return { user_id: null, display_name: '', email: null, role_id: null }
}
