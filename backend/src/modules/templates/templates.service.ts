import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import { ProjectsService } from '../projects';
import { MilestonesService } from '../milestones';
import { ProgramOutcomesService } from '../program-outcomes';
import { CreateMilestoneDto } from '../milestones';
import { dayOffset, materializeOffset } from './templates.logic';

interface TemplateOutcome {
  key: number;
  name: string;
  sort_order: number | null;
  start_offset: number | null;
  end_offset: number | null;
}

interface TemplateMilestone {
  name: string;
  description: string | null;
  outcome_key: number | null;
  weightage: number | null;
  is_major: boolean;
  start_offset: number | null;
  due_offset: number | null;
}

interface TemplatePayload {
  fields: Record<string, unknown>;
  outcomes: TemplateOutcome[];
  milestones: TemplateMilestone[];
}

export interface TemplateListItem {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  outcome_count: number;
  milestone_count: number;
}

/** Fields copied verbatim into new projects (no dates, people, or numbers
 *  that belong to a specific delivery). */
const FIELD_KEYS = [
  'description',
  'goal',
  'target_group',
  'is_priority',
  'category_id',
  'sector_id',
  'deal_type_id',
  'tier_id',
  'size_id',
  'strategic_objective_id',
  'strategic_program_id',
] as const;

/**
 * Project Templates: snapshot a project's structure (field defaults +
 * outcomes + milestones, dates as day-offsets from project start) into a
 * jsonb payload; instantiate through the normal services so audit/history
 * behave like manual creation.
 */
@Injectable()
export class TemplatesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly projects: ProjectsService,
    private readonly milestones: MilestonesService,
    private readonly outcomes: ProgramOutcomesService,
  ) {}

  async list(): Promise<TemplateListItem[]> {
    const { data, error } = await this.db.client
      .from('project_templates')
      .select('id, name, description, created_at, payload')
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'templates.list');
    return ((data ?? []) as Array<Record<string, unknown>>).map((t) => {
      const payload = t.payload as TemplatePayload;
      return {
        id: t.id as string,
        name: t.name as string,
        description: (t.description as string | null) ?? null,
        created_at: t.created_at as string,
        outcome_count: payload?.outcomes?.length ?? 0,
        milestone_count: payload?.milestones?.length ?? 0,
      };
    });
  }

  async createFromProject(
    name: string,
    description: string | null,
    projectId: string,
    userId: string,
  ): Promise<TemplateListItem> {
    const [project, outcomes, milestones] = await Promise.all([
      this.db.client
        .from('projects')
        .select(
          'id, name, start_date, description, goal, target_group, is_priority, category_id, sector_id, deal_type_id, tier_id, size_id, strategic_objective_id, strategic_program_id',
        )
        .eq('id', projectId)
        .maybeSingle<Record<string, unknown>>(),
      this.db.client
        .from('program_outcomes')
        .select('id, name, sort_order, start_date, end_date')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true, nullsFirst: false }),
      this.db.client
        .from('milestones')
        .select(
          'name, description, outcome_id, weightage, is_major, start_date, due_date',
        )
        .eq('project_id', projectId),
    ]);
    const failed = project.error ?? outcomes.error ?? milestones.error;
    if (failed) throw toHttpException(failed, 'templates.snapshot');
    if (!project.data) throw new NotFoundException('Source project not found.');

    const base = (project.data.start_date as string | null) ?? null;
    const outcomeKey = new Map<string, number>();
    const payloadOutcomes: TemplateOutcome[] = (
      (outcomes.data ?? []) as Array<Record<string, unknown>>
    ).map((o, i) => {
      outcomeKey.set(o.id as string, i);
      return {
        key: i,
        name: o.name as string,
        sort_order: (o.sort_order as number | null) ?? null,
        start_offset: dayOffset(o.start_date as string | null, base),
        end_offset: dayOffset(o.end_date as string | null, base),
      };
    });
    const payloadMilestones: TemplateMilestone[] = (
      (milestones.data ?? []) as Array<Record<string, unknown>>
    ).map((m) => ({
      name: m.name as string,
      description: (m.description as string | null) ?? null,
      outcome_key: m.outcome_id
        ? (outcomeKey.get(m.outcome_id as string) ?? null)
        : null,
      weightage: (m.weightage as number | null) ?? null,
      is_major: Boolean(m.is_major),
      start_offset: dayOffset(m.start_date as string | null, base),
      due_offset: dayOffset(m.due_date as string | null, base),
    }));

    const fields: Record<string, unknown> = {};
    for (const key of FIELD_KEYS) {
      const value = project.data[key];
      if (value != null && value !== '') fields[key] = value;
    }

    const payload: TemplatePayload = {
      fields,
      outcomes: payloadOutcomes,
      milestones: payloadMilestones,
    };
    const { data, error } = await this.db.client
      .from('project_templates')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        payload,
        created_by: userId,
      })
      .select('id, name, description, created_at')
      .single<Record<string, unknown>>();
    if (error) throw toHttpException(error, 'templates.create');
    return {
      id: data.id as string,
      name: data.name as string,
      description: (data.description as string | null) ?? null,
      created_at: data.created_at as string,
      outcome_count: payloadOutcomes.length,
      milestone_count: payloadMilestones.length,
    };
  }

  async remove(templateId: string): Promise<{ deleted: boolean }> {
    const { data, error } = await this.db.client
      .from('project_templates')
      .delete()
      .eq('id', templateId)
      .select('id')
      .maybeSingle<{ id: string }>();
    if (error) throw toHttpException(error, 'templates.remove');
    if (!data) throw new NotFoundException('Template not found.');
    return { deleted: true };
  }

  async instantiate(
    templateId: string,
    dto: { name: string; start_date?: string; target_end_date?: string },
    userId: string,
  ): Promise<{ project_id: string; name: string }> {
    const { data, error } = await this.db.client
      .from('project_templates')
      .select('payload')
      .eq('id', templateId)
      .maybeSingle<{ payload: TemplatePayload }>();
    if (error) throw toHttpException(error, 'templates.load');
    if (!data) throw new NotFoundException('Template not found.');
    const name = dto.name.trim();
    if (!name) throw new BadRequestException('A project name is required.');
    const payload = data.payload;
    const base = dto.start_date ?? null;

    const project = await this.projects.create(
      {
        ...payload.fields,
        name,
        start_date: dto.start_date,
        target_end_date: dto.target_end_date,
      },
      userId,
    );

    const outcomeIdByKey = new Map<number, string>();
    for (const o of payload.outcomes ?? []) {
      const created = await this.outcomes.add(
        project.id,
        {
          name: o.name,
          sort_order: o.sort_order ?? undefined,
          start_date: materializeOffset(base, o.start_offset) ?? undefined,
          end_date: materializeOffset(base, o.end_offset) ?? undefined,
        },
        userId,
      );
      outcomeIdByKey.set(o.key, (created as { id: string }).id);
    }
    for (const m of payload.milestones ?? []) {
      await this.milestones.add(
        project.id,
        {
          name: m.name,
          description: m.description ?? undefined,
          outcome_id:
            m.outcome_key != null
              ? (outcomeIdByKey.get(m.outcome_key) ?? undefined)
              : undefined,
          weightage: m.weightage ?? undefined,
          is_major: m.is_major,
          start_date: materializeOffset(base, m.start_offset) ?? undefined,
          due_date: materializeOffset(base, m.due_offset) ?? undefined,
          status: 'open',
        } as CreateMilestoneDto,
        userId,
      );
    }
    return { project_id: project.id, name: project.name };
  }
}
