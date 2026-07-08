import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatesRepository } from './updates.repository';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';

@Injectable()
export class UpdatesService {
  constructor(private readonly repo: UpdatesRepository) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  add(projectId: string, dto: CreateUpdateDto, userId: string) {
    if (!dto.body?.trim()) {
      throw new BadRequestException('An update is required.');
    }
    return this.repo.insert({
      project_id: projectId,
      body: dto.body.trim(),
      type_id: dto.type_id ?? null,
      is_gold: dto.is_gold ?? false,
      tags: dto.tags?.length ? dto.tags : null,
      author_id: userId,
      created_by: userId,
      updated_by: userId,
    });
  }

  update(
    projectId: string,
    updateId: string,
    dto: UpdateUpdateDto,
    userId: string,
  ) {
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.body !== undefined) patch.body = dto.body.trim();
    if (dto.type_id !== undefined) patch.type_id = dto.type_id ?? null;
    if (dto.is_gold !== undefined) patch.is_gold = dto.is_gold;
    if (dto.tags !== undefined) patch.tags = dto.tags?.length ? dto.tags : null;
    return this.repo.update(projectId, updateId, patch);
  }
}