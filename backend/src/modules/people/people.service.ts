import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectAccessService } from '../../common/access/project-access.service';
import { PeopleRepository } from './people.repository';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PeopleService {
  constructor(
    private readonly repo: PeopleRepository,
    private readonly access: ProjectAccessService,
  ) {}

  async add(projectId: string, dto: CreatePersonDto, userId: string) {
    if (!dto.user_id && !dto.pending_name?.trim()) {
      throw new BadRequestException('A user or a name is required.');
    }
    if (!dto.user_id && !dto.pending_email?.trim()) {
      throw new BadRequestException(
        'Pending people need an email — it is how their account gets linked later.',
      );
    }
    const row = await this.repo.insert({
      project_id: projectId,
      user_id: dto.user_id ?? null,
      pending_name: dto.user_id ? null : (dto.pending_name?.trim() ?? null),
      pending_email: dto.user_id
        ? null
        : (dto.pending_email?.trim().toLowerCase() ?? null),
      role_id: dto.role_id,
      access_level: dto.access_level,
      involvement_level_id: dto.involvement_level_id ?? null,
      notes: dto.notes?.trim() || null,
      access_type: 'assigned',
      status: dto.user_id ? 'active' : 'pending',
      created_by: userId,
      updated_by: userId,
    });
    this.access.invalidateMemberships(projectId);
    return row;
  }

  async update(
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
    if (dto.pending_email !== undefined)
      patch.pending_email = dto.pending_email?.trim().toLowerCase() || null;
    const updated = await this.repo.update(projectId, memberId, patch);
    if (!updated) throw new NotFoundException('Member not found.');
    this.access.invalidateMemberships(projectId);
    return updated;
  }

  async remove(projectId: string, memberId: string) {
    const deleted = await this.repo.remove(projectId, memberId);
    if (!deleted) throw new NotFoundException('Member not found.');
    this.access.invalidateMemberships(projectId);
    return { deleted: true };
  }
}
