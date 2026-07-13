import { Injectable } from '@nestjs/common';
import { LinksRepository } from './links.repository';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinksService {
  constructor(private readonly repo: LinksRepository) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  add(projectId: string, dto: CreateLinkDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      url: dto.url.trim(),
      label: dto.label?.trim() || null,
      description: dto.description?.trim() || null,
      is_gold: dto.is_gold ?? false,
      tags: dto.tags?.length ? dto.tags : null,
      created_by: userId,
      updated_by: userId,
    });
  }

  update(
    projectId: string,
    linkId: string,
    dto: UpdateLinkDto,
    userId: string,
  ) {
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.url !== undefined) patch.url = dto.url.trim();
    if (dto.label !== undefined) patch.label = dto.label?.trim() || null;
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    if (dto.is_gold !== undefined) patch.is_gold = dto.is_gold;
    if (dto.tags !== undefined) patch.tags = dto.tags?.length ? dto.tags : null;
    return this.repo.update(projectId, linkId, patch);
  }
}
