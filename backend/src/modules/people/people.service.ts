import { BadRequestException, Injectable } from '@nestjs/common';
import { PeopleRepository } from './people.repository';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PeopleService {
  constructor(private readonly repo: PeopleRepository) {}

  async add(projectId: string, dto: CreatePersonDto, userId: string) {
    if (!dto.user_id && !dto.pending_name?.trim()) {
      throw new BadRequestException('A user or a name is required.');
    }
    return this.repo.insert({
      project_id: projectId,
      user_id: dto.user_id ?? null,
      pending_name: dto.user_id ? null : (dto.pending_name?.trim() ?? null),
      role_id: dto.role_id,
      access_level: dto.access_level,
      involvement_level_id: dto.involvement_level_id ?? null,
      notes: dto.notes?.trim() || null,
      access_type: 'assigned',
      status: dto.user_id ? 'active' : 'pending',
      created_by: userId,
      updated_by: userId,
    });
  }

  update(
    projectId: string,
    memberId: string,
    dto: UpdatePersonDto,
    userId: string,
  ) {
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.role_id !== undefined) patch.role_id = dto.role_id;
    if (dto.access_level !== undefined) patch.access_level = dto.access_level;
    if (dto.involvement_level_id !== undefined)
      patch.involvement_level_id = dto.involvement_level_id ?? null;
    if (dto.notes !== undefined) patch.notes = dto.notes?.trim() || null;
    return this.repo.update(projectId, memberId, patch);
  }

  async remove(projectId: string, memberId: string) {
    await this.repo.remove(projectId, memberId);
    return { deleted: true };
  }
}