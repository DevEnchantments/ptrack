import { Injectable } from '@nestjs/common';
import { ResourcesRepository } from './resources.repository';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly repo: ResourcesRepository) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  add(projectId: string, dto: CreateResourceDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      name: dto.name.trim(),
      type_id: dto.type_id,
      description: dto.description?.trim() || null,
      created_by: userId,
      updated_by: userId,
    });
  }

  update(
    projectId: string,
    resourceId: string,
    dto: UpdateResourceDto,
    userId: string,
  ) {
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.type_id !== undefined) patch.type_id = dto.type_id;
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    return this.repo.update(projectId, resourceId, patch);
  }
}
