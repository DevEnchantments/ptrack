import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface StatusReport {
  id: string;
  project_id: string;
  title: string | null;
  summary: string | null;
  report_date: string;
  viewable_by: string;
  editable_by: string;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatusReportListItem extends StatusReport {
  author: { full_name: string | null; email: string | null } | null;
}

export interface StatusReportDetail extends StatusReportListItem {
  project: { name: string } | null;
}

const COLUMNS =
  'id, project_id, title, summary, report_date, viewable_by, editable_by, author_id, created_at, updated_at';

/** The list read: columns plus the author join every list-shaped row carries. */
const LIST_SELECT = `${COLUMNS},
  author:profiles!author_id ( full_name, email )`;

/** The detail read: the list shape plus the parent project's name. */
const DETAIL_SELECT = `${LIST_SELECT}, project:projects ( name )`;

@Injectable()
export class StatusReportsRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('status_reports');
  }

  async insert(row: Record<string, unknown>): Promise<StatusReportListItem> {
    const { data, error } = await this.table
      .insert(row)
      .select(LIST_SELECT)
      .single();
    if (error) throw toHttpException(error, 'statusReports.insert');
    return data as unknown as StatusReportListItem;
  }

  /**
   * Null when the report is not in this project. `maybeSingle`, not `single`:
   * `single` turns "no rows" into a PostgREST error whose code falls through
   * toHttpException's default and surfaces as a 500 instead of a 404.
   */
  async update(
    projectId: string,
    statusReportId: string,
    patch: Record<string, unknown>,
  ): Promise<StatusReportListItem | null> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', statusReportId)
      .select(LIST_SELECT)
      .maybeSingle();
    if (error) throw toHttpException(error, 'statusReports.update');
    return (data as unknown as StatusReportListItem) ?? null;
  }

  async findOne(
    projectId: string,
    statusReportId: string,
  ): Promise<StatusReportDetail | null> {
    const { data, error } = await this.table
      .select(DETAIL_SELECT)
      .eq('project_id', projectId)
      .eq('id', statusReportId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'statusReports.findOne');
    return (data as unknown as StatusReportDetail) ?? null;
  }

  /** Returns the deleted row's id+label, or null when not in this project. */
  async remove(
    projectId: string,
    statusReportId: string,
  ): Promise<{ id: string; label: string | null } | null> {
    const { data, error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', statusReportId)
      .select('id, title')
      .maybeSingle<{ id: string; title: string | null }>();
    if (error) throw toHttpException(error, 'statusReports.remove');
    return data ? { id: data.id, label: data.title } : null;
  }

  async findByProject(projectId: string): Promise<StatusReportListItem[]> {
    const { data, error } = await this.table
      .select(LIST_SELECT)
      .eq('project_id', projectId)
      .order('report_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'statusReports.findByProject');
    return (data ?? []) as unknown as StatusReportListItem[];
  }
}
