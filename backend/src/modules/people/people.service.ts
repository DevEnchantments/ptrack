import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { PeopleRepository } from './people.repository';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

/**
 * A project member is either a linked account or a pending invite, and four
 * columns follow from which one it is: a linked member carries no pending
 * fields and starts active, an invite carries them and starts pending.
 *
 * Those four move together, so they are decided in one place. The identity
 * check lives here too, because "who is this member" is the same question:
 * an invite needs a name to show and an email, since the email is what links
 * the account when they later claim it.
 */
function provisioningFields(dto: CreatePersonDto): {
  user_id: string | null;
  pending_name: string | null;
  pending_email: string | null;
  status: 'active' | 'pending';
} {
  if (dto.user_id) {
    return {
      user_id: dto.user_id,
      pending_name: null,
      pending_email: null,
      status: 'active',
    };
  }
  if (!dto.pending_name?.trim()) {
    throw new BadRequestException('A user or a name is required.');
  }
  if (!dto.pending_email?.trim()) {
    throw new BadRequestException(
      'Pending people need an email — it is how their account gets linked later.',
    );
  }
  return {
    user_id: null,
    pending_name: dto.pending_name.trim(),
    pending_email: dto.pending_email.trim().toLowerCase(),
    status: 'pending',
  };
}

@Injectable()
export class PeopleService {
  constructor(
    private readonly repo: PeopleRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  async add(projectId: string, dto: CreatePersonDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      ...provisioningFields(dto),
      role_id: dto.role_id,
      access_level: dto.access_level,
      involvement_level_id: dto.involvement_level_id ?? null,
      notes: dto.notes?.trim() || null,
      access_type: 'assigned',
      created_by: userId,
      updated_by: userId,
    });
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
    return updated;
  }

  async remove(projectId: string, memberId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, memberId);
    if (!deleted) throw new NotFoundException('Member not found.');
    // Every other module audits its deletes; this one did not, so removing
    // someone from a project left no trace of who did it (FOLLOW-UPS F1).
    await this.auditLog.logDeleted({
      table: 'project_members',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
