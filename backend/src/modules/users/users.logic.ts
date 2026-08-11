/** Pure claim planning (unit-tested): which pending memberships convert to
 *  real ones, and which must be deleted because the user is already a real
 *  member of that project (the unique(project_id, user_id) constraint would
 *  reject the update). */

export interface PendingMembershipRow {
  id: string;
  project_id: string;
}

export function planClaim(
  pending: PendingMembershipRow[],
  existingProjectIds: Set<string>,
): { toUpdate: string[]; toDelete: string[] } {
  const toUpdate: string[] = [];
  const toDelete: string[] = [];
  for (const row of pending) {
    if (existingProjectIds.has(row.project_id)) toDelete.push(row.id);
    else toUpdate.push(row.id);
  }
  return { toUpdate, toDelete };
}
