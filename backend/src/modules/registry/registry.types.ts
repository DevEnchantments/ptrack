/**
 * Shapes the registry reads and returns. Kept beside the module rather than in
 * the service so the repository and the service can share them without either
 * importing the other.
 */

export interface GlobalMilestone {
  id: string;
  project_id: string;
  name: string;
  due_date: string | null;
  status: string;
  is_major: boolean;
  weightage: number | null;
  percent_complete: number | null;
  completed_date: string | null;
  tags: string[] | null;
  project: { name: string } | null;
  owner: { full_name: string | null; email: string | null } | null;
  outcome: { name: string } | null;
}

export interface GlobalActionItem {
  id: string;
  project_id: string;
  title: string;
  due_date: string | null;
  status: string;
  tags: string[] | null;
  project: { name: string } | null;
  type: { name: string } | null;
  owners: Array<{
    slot: number;
    user_id: string;
    profile: { full_name: string | null; email: string | null } | null;
  }>;
}

export interface DirectoryMembership {
  project_id: string;
  project_name: string | null;
  role: string | null;
  access_level: string;
  status: string;
}

export interface DirectoryPerson {
  key: string;
  user_id: string | null;
  name: string;
  email: string | null;
  pending: boolean;
  memberships: DirectoryMembership[];
}

/** One row of `project_members` with the joins the directory needs. */
export interface MemberRow {
  project_id: string;
  user_id: string | null;
  pending_name: string | null;
  pending_email: string | null;
  access_level: string;
  status: string;
  role: { name: string } | null;
  profile: { full_name: string | null; email: string | null } | null;
  project: { name: string } | null;
}
