import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionItemsRepository } from './action-items.repository';
import { CreateActionItemDto } from './dto/create-action-item.dto';


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