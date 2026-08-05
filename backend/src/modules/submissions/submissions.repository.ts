import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface Cycle {
  id: string;
  name: string;
  period_start: string;
  period_end: string;
  status: string;
}

export interface Submission {
  id: string;
  project_id: string;
  cycle_id: string;
  status: string;
  comment: string | null;
  decision_comment: string | null;
  submitted_by: string | null;
  submitted_at: string | null;
  validated_at: string | null;
  approved_at: string | null;
  returned_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionListItem extends Submission {
  cycle: Cycle | null;
  submitter: { full_name: string | null; email: string | null } | null;
  validator: { full_name: string | null; email: string | null } | null;
  approver: { full_name: string | null; email: string | null } | null;
  returner: { full_name: string | null; email: string | null } | null;
}

const COLUMNS =
  'id, project_id, cycle_id, status, comment, decision_comment, submitted_by, submitted_at, validated_at, approved_at, returned_at, created_at, updated_at';

const JOINS = `${COLUMNS},
  cycle:cycles ( id, name, period_start, period_end, status ),
  submitter:profiles!submitted_by ( full_name, email ),
  validator:profiles!validated_by ( full_name, email ),
  approver:profiles!approved_by ( full_name, email ),
  returner:profiles!returned_by ( full_name, email )`;

@Injectable()
export class SubmissionsRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('submissions');
  }

  /** The calendar-month cycle containing `date`, created on first use. */
  async getOrCreateCycleFor(date: Date): Promise<Cycle> {
    const start = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
    );
    const end = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
    );
    const startIso = start.toISOString().slice(0, 10);
    const endIso = end.toISOString().slice(0, 10);

    const existing = await this.db.client
      .from('cycles')
      .select('id, name, period_start, period_end, status')
      .eq('period_start', startIso)
      .eq('period_end', endIso)
      .maybeSingle<Cycle>();
    if (existing.error)
      throw toHttpException(existing.error, 'cycles.getOrCreate');
    if (existing.data) return existing.data;

    const name = start.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const created = await this.db.client
      .from('cycles')
      .insert({ name, period_start: startIso, period_end: endIso })
      .select('id, name, period_start, period_end, status')
      .single<Cycle>();
    if (created.error)
      throw toHttpException(created.error, 'cycles.getOrCreate');
    return created.data;
  }

  async findByProject(projectId: string): Promise<SubmissionListItem[]> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'submissions.findByProject');
    return (data ?? []) as unknown as SubmissionListItem[];
  }

  async findOne(
    projectId: string,
    submissionId: string,
  ): Promise<SubmissionListItem | null> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .eq('id', submissionId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'submissions.findOne');
    return (data as unknown as SubmissionListItem) ?? null;
  }

  async findForCycle(
    projectId: string,
    cycleId: string,
  ): Promise<SubmissionListItem | null> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .eq('cycle_id', cycleId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'submissions.findForCycle');
    return (data as unknown as SubmissionListItem) ?? null;
  }

  async insert(row: Record<string, unknown>): Promise<SubmissionListItem> {
    const { data, error } = await this.table.insert(row).select(JOINS).single();
    if (error) throw toHttpException(error, 'submissions.insert');
    return data as unknown as SubmissionListItem;
  }

  async update(
    submissionId: string,
    patch: Record<string, unknown>,
  ): Promise<SubmissionListItem> {
    const { data, error } = await this.table
      .update(patch)
      .eq('id', submissionId)
      .select(JOINS)
      .single();
    if (error) throw toHttpException(error, 'submissions.update');
    return data as unknown as SubmissionListItem;
  }
}
