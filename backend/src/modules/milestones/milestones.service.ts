import { Injectable } from '@nestjs/common';
import { MilestonesRepository } from './milestones.repository';
import { CreateMilestoneDto } from './dto/create-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private readonly repo: MilestonesRepository) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
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
}