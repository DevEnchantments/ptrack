import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { ActionItemsRepository } from './action-items.repository';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { UpdateActionItemDto } from './dto/update-action-item.dto';

type Owners = Array<{
  slot: number;
  profile: { full_name: string | null; email: string | null } | null;
}>;

/**
 * Owners rendered as history text, in slot order — e.g. "Dana Whitfield, Sam Ali".
 * Empty string when there are none, matching how the trigger renders null values.
 */
function ownersLabel(owners: Owners | undefined): string {
  return (owners ?? [])
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((o) => o.profile?.full_name || o.profile?.email || 'Unknown')
    .join(', ');
}

@Injectable()
export class ActionItemsService {
  constructor(
    private readonly repo: ActionItemsRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  async add(projectId: string, dto: CreateActionItemDto, userId: string) {
    const item = await this.repo.insert({
      project_id: projectId,
      milestone_id: dto.milestone_id ?? null,
      title: dto.title.trim(),
      description: dto.description?.trim() || null,
      type_id: dto.type_id ?? null,
      role_id: dto.role_id ?? null,
      due_date: dto.due_date,
      status: dto.status,
      tags: dto.tags?.length ? dto.tags : null,
      created_by: userId,
      updated_by: userId,
    });

    const ownerIds = [...new Set(dto.owner_ids ?? [])].slice(0, 4);
    await this.repo.insertOwners(item.id, ownerIds);

    return item;
  }

  async get(projectId: string, actionItemId: string) {
    const item = await this.repo.findOne(projectId, actionItemId);
    if (!item) throw new NotFoundException('Action item not found.');
    return item;
  }

  async update(
    projectId: string,
    actionItemId: string,
    dto: UpdateActionItemDto,
    userId: string,
  ) {
    // Ensures the item exists in this project (404 otherwise). Kept so the
    // owner set can be diffed after the write.
    const before = await this.get(projectId, actionItemId);

    // Owners first — one atomic RPC — so the joined select on the column
    // update below already returns the new set.
    if (dto.owner_ids !== undefined) {
      const ownerIds = [...new Set(dto.owner_ids ?? [])].slice(0, 4);
      await this.repo.replaceOwners(actionItemId, ownerIds);
    }

    // Build the column patch only from fields that were provided.
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.title !== undefined) patch.title = dto.title.trim();
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    if (dto.due_date !== undefined) patch.due_date = dto.due_date;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.milestone_id !== undefined)
      patch.milestone_id = dto.milestone_id ?? null;
    if (dto.type_id !== undefined) patch.type_id = dto.type_id ?? null;
    if (dto.role_id !== undefined) patch.role_id = dto.role_id ?? null;
    if (dto.tags !== undefined) patch.tags = dto.tags?.length ? dto.tags : null;

    // The update returns the fully-joined row, so no follow-up get is needed.
    const after = await this.repo.update(projectId, actionItemId, patch);

    // Owners are replaced wholesale on every save, so the DB trigger cannot tell
    // a real change from a rewrite of the same set — and it never sees the join
    // table anyway. Diff the rendered sets and log one entry only if they differ.
    const oldOwners = ownersLabel(before.owners);
    const newOwners = ownersLabel(after.owners);
    if (oldOwners !== newOwners) {
      await this.repo.insertHistory({
        table_name: 'action_items',
        record_id: actionItemId,
        project_id: projectId,
        field_label: 'Owners',
        old_value: oldOwners,
        new_value: newOwners,
        changed_by: userId,
      });
    }

    return after;
  }

  async history(projectId: string, actionItemId: string) {
    await this.get(projectId, actionItemId); // 404 if not in this project
    return this.repo.findHistory(projectId, actionItemId);
  }

  async remove(projectId: string, actionItemId: string, userId: string) {
    const item = await this.get(projectId, actionItemId); // 404 if not in this project
    await this.repo.remove(projectId, actionItemId);
    await this.auditLog.logDeleted({
      table: 'action_items',
      recordId: actionItemId,
      projectId,
      label: item.title,
      userId,
    });
    return { deleted: true };
  }

  async listComments(projectId: string, actionItemId: string) {
    await this.get(projectId, actionItemId); // 404s if item not in this project
    return this.repo.listComments(actionItemId);
  }

  async addComment(
    projectId: string,
    actionItemId: string,
    body: string,
    authorId: string,
  ) {
    await this.get(projectId, actionItemId);
    return this.repo.insertComment(actionItemId, body.trim(), authorId);
  }
}
