import { Injectable, NotFoundException } from '@nestjs/common';
import { MilestonesRepository } from './milestones.repository';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private readonly repo: MilestonesRepository) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  async get(projectId: string, milestoneId: string) {
    const milestone = await this.repo.findOne(projectId, milestoneId);
    if (!milestone) throw new NotFoundException('Milestone not found.');
    return milestone;
  }

  add(projectId: string, dto: CreateMilestoneDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      start_date: dto.start_date,
      due_date: dto.due_date,
      status: dto.status,
      role_id: dto.role_id ?? null,
      owner_id: dto.owner_id ?? null,
      is_major: dto.is_major ?? false,
      tags: dto.tags?.length ? dto.tags : null,
      weightage: dto.weightage ?? null,
      percent_complete: dto.percent_complete ?? null,
      created_by: userId,
      updated_by: userId,
    });
  }

  async update(
    projectId: string,
    milestoneId: string,
    dto: UpdateMilestoneDto,
    userId: string,
  ) {
    // Ensures the milestone exists in this project (404 otherwise).
    await this.get(projectId, milestoneId);

    // Build the column patch only from fields that were provided.
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    if (dto.start_date !== undefined) patch.start_date = dto.start_date;
    if (dto.due_date !== undefined) patch.due_date = dto.due_date;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.role_id !== undefined) patch.role_id = dto.role_id ?? null;
    if (dto.owner_id !== undefined) patch.owner_id = dto.owner_id ?? null;
    if (dto.is_major !== undefined) patch.is_major = dto.is_major;
    if (dto.tags !== undefined) patch.tags = dto.tags?.length ? dto.tags : null;
    if (dto.weightage !== undefined) patch.weightage = dto.weightage ?? null;
    if (dto.percent_complete !== undefined)
      patch.percent_complete = dto.percent_complete ?? null;

    await this.repo.update(projectId, milestoneId, patch);

    // Return the fully-joined milestone so the UI can refresh.
    return this.get(projectId, milestoneId);
  }

  async remove(projectId: string, milestoneId: string) {
    await this.get(projectId, milestoneId); // 404 if not in this project
    await this.repo.remove(projectId, milestoneId);
    return { deleted: true };
  }
}
