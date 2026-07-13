import { Injectable } from '@nestjs/common';
import { IssuesRepository } from './issues.repository';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

@Injectable()
export class IssuesService {
  constructor(private readonly repo: IssuesRepository) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  add(projectId: string, dto: CreateIssueDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      title: dto.title.trim(),
      role_id: dto.role_id ?? null,
      owner_id: dto.owner_id ?? null,
      status: dto.status ?? 'open',
      level_id: dto.level_id ?? null,
      category_id: dto.category_id ?? null,
      description: dto.description?.trim() || null,
      url: dto.url?.trim() || null,
      tags: dto.tags?.length ? dto.tags : null,
      resolution: dto.resolution?.trim() || null,
      created_by: userId,
      updated_by: userId,
    });
  }

  update(
    projectId: string,
    issueId: string,
    dto: UpdateIssueDto,
    userId: string,
  ) {
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.title !== undefined) patch.title = dto.title.trim();
    if (dto.role_id !== undefined) patch.role_id = dto.role_id ?? null;
    if (dto.owner_id !== undefined) patch.owner_id = dto.owner_id ?? null;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.level_id !== undefined) patch.level_id = dto.level_id ?? null;
    if (dto.category_id !== undefined)
      patch.category_id = dto.category_id ?? null;
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    if (dto.url !== undefined) patch.url = dto.url?.trim() || null;
    if (dto.tags !== undefined) patch.tags = dto.tags?.length ? dto.tags : null;
    if (dto.resolution !== undefined)
      patch.resolution = dto.resolution?.trim() || null;
    return this.repo.update(projectId, issueId, patch);
  }
}
