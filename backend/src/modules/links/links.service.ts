import { Injectable } from '@nestjs/common';
import { LinksRepository } from './links.repository';
import { CreateLinkDto } from './dto/create-link.dto';

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
}