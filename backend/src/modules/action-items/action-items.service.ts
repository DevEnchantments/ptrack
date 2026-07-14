import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionItemsRepository } from './action-items.repository';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { UpdateActionItemDto } from './dto/update-action-item.dto';

@Injectable()
export class ActionItemsService {
  constructor(private readonly repo: ActionItemsRepository) {}

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
    // Ensures the item exists in this project (404 otherwise).
    await this.get(projectId, actionItemId);

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

    await this.repo.update(projectId, actionItemId, patch);

    // Owners: if provided, replace the whole set (delete + re-insert in order).
    if (dto.owner_ids !== undefined) {
      const ownerIds = [...new Set(dto.owner_ids ?? [])].slice(0, 4);
      await this.repo.deleteOwners(actionItemId);
      await this.repo.insertOwners(actionItemId, ownerIds);
    }

    // Return the fully-joined item so the UI can refresh.
    return this.get(projectId, actionItemId);
  }

  async history(projectId: string, actionItemId: string) {
    await this.get(projectId, actionItemId); // 404 if not in this project
    return this.repo.findHistory(projectId, actionItemId);
  }

  async remove(projectId: string, actionItemId: string) {
    await this.get(projectId, actionItemId); // 404 if not in this project
    await this.repo.remove(projectId, actionItemId);
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
