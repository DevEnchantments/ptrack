import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { ActionItemsRepository } from './action-items.repository';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { UpdateActionItemDto } from './dto/update-action-item.dto';
import { AttachmentsService } from '../attachments';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

type Owners = Array<{
  slot: number;
  profile: { full_name: string | null; email: string | null } | null;
}>;

/** The action_item_owners join table has four slots; extras are dropped. */
const MAX_OWNER_SLOTS = 4;

/** How an action-item DTO maps onto columns, for both create and update. */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['title'],
  trimmedOrNull: ['description'],
  nullable: ['milestone_id', 'type_id', 'role_id'],
  arrayOrNull: ['tags'],
  asIs: ['due_date', 'status'],
};

/** What a new item gets for the columns the caller omitted. */
const CREATE_DEFAULTS = {
  milestone_id: null,
  description: null,
  type_id: null,
  role_id: null,
  tags: null,
};

/** De-duplicated, capped at the number of slots the join table actually has. */
function normalizeOwnerIds(ownerIds: string[] | undefined): string[] {
  return [...new Set(ownerIds ?? [])].slice(0, MAX_OWNER_SLOTS);
}

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
    private readonly attachments: AttachmentsService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  async add(projectId: string, dto: CreateActionItemDto, userId: string) {
    const item = await this.repo.insert({
      project_id: projectId,
      ...CREATE_DEFAULTS,
      ...columnsFrom(dto, COLUMN_SPEC),
      created_by: userId,
      updated_by: userId,
    });

    await this.repo.insertOwners(item.id, normalizeOwnerIds(dto.owner_ids));

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
      await this.repo.replaceOwners(
        actionItemId,
        normalizeOwnerIds(dto.owner_ids),
      );
    }

    // The update returns the fully-joined row, so no follow-up get is needed.
    const after = await this.repo.update(projectId, actionItemId, {
      updated_by: userId,
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    // The get() above already 404s for a foreign id; this catches the row
    // being deleted in between, which used to surface as a 500.
    if (!after) throw new NotFoundException('Action item not found.');

    await this.logOwnerChange(projectId, actionItemId, before, after, userId);

    return after;
  }

  /**
   * Owners are replaced wholesale on every save, so the DB trigger cannot tell a
   * real change from a rewrite of the same set — and it never sees the join
   * table anyway. Diff the rendered sets and log one entry only if they differ.
   */
  private async logOwnerChange(
    projectId: string,
    actionItemId: string,
    before: { owners?: Owners },
    after: { owners?: Owners },
    userId: string,
  ): Promise<void> {
    const oldOwners = ownersLabel(before.owners);
    const newOwners = ownersLabel(after.owners);
    if (oldOwners === newOwners) return;

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

  async history(projectId: string, actionItemId: string) {
    await this.get(projectId, actionItemId); // 404 if not in this project
    return this.repo.findHistory(projectId, actionItemId);
  }

  async remove(projectId: string, actionItemId: string, userId: string) {
    const item = await this.get(projectId, actionItemId); // 404 if not in this project
    // Task-scoped attachments have no FK to cascade on — clean them up here
    // (rows + Storage objects) before the task row goes.
    await this.attachments.removeByParent(
      projectId,
      { type: 'action_item', id: actionItemId },
      userId,
    );
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
