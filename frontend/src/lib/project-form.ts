import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'

export function emptyMember(): ProjectMemberInput {
  return { user_id: null, display_name: '', email: null, role_id: null }
}
