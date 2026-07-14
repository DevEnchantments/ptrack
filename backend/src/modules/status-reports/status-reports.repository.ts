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

const JOINS = `${COLUMNS},
  author:profiles!author_id ( full_name, email )`;

@Injectable()
export class StatusReportsRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('status_reports');
  }

  async insert(row: Record<string, unknown>): Promise<StatusReportListItem> {
    const { data, error } = await this.table.insert(row).select(JOINS).single();
    if (error) throw toHttpException(error, 'statusReports.insert');
    return data as unknown as StatusReportListItem;
  }

  async update(
    projectId: string,
    statusReportId: string,
    patch: Record<string, unknown>,
  ): Promise<StatusReportListItem> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', statusReportId)
      .select(JOINS)
      .single();
    if (error) throw toHttpException(error, 'statusReports.update');
    return data as unknown as StatusReportListItem;
  }

  async findOne(
    projectId: string,
    statusReportId: string,
  ): Promise<StatusReportDetail | null> {
    const { data, error } = await this.table
      .select(`${JOINS}, project:projects ( name )`)
      .eq('project_id', projectId)
      .eq('id', statusReportId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'statusReports.findOne');
    return (data as unknown as StatusReportDetail) ?? null;
  }

  /** Returns the deleted id, or null when the report is not in this project. */
  async remove(
    projectId: string,
    statusReportId: string,
  ): Promise<string | null> {
    const { data, error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', statusReportId)
      .select('id')
      .maybeSingle<{ id: string }>();
    if (error) throw toHttpException(error, 'statusReports.remove');
    return data?.id ?? null;
  }

  async findByProject(projectId: string): Promise<StatusReportListItem[]> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .order('report_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'statusReports.findByProject');
    return (data ?? []) as unknown as StatusReportListItem[];
  }
}
