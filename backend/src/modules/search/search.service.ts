import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';

export type SearchKind =
  'project' | 'milestone' | 'action_item' | 'issue' | 'risk' | 'kpi';

export interface SearchHit {
  kind: SearchKind;
  id: string;
  label: string;
  project_id: string | null;
  project_name: string | null;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  created_at: string;
}

interface ChildRow {
  id: string;
  label: string;
  project_id: string;
  project: { name: string } | null;
}

const PER_KIND = 8;

/**
 * Global record search (original-app roadmap). Case-insensitive substring
 * match per kind, capped at PER_KIND hits each, all kinds queried in
 * parallel. Not full-text: update/comment bodies are deliberately out of
 * scope for v1.
 */
@Injectable()
export class SearchService {
  constructor(private readonly db: DatabaseService) {}

  async search(q: string): Promise<{ query: string; hits: SearchHit[] }> {
    // Strip characters that would break PostgREST's or-filter syntax, and
    // escape ilike wildcards so users match them literally.
    const clean = (q ?? '')
      .trim()
      .replace(/[,()"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (clean.length < 2) return { query: clean, hits: [] };
    const pat = `%${clean.replace(/[%_]/g, (m) => `\\${m}`)}%`;

    const child = (table: string, labelCol: string) =>
      this.db.client
        .from(table)
        .select(`id, label:${labelCol}, project_id, project:projects ( name )`)
        .ilike(labelCol, pat)
        .limit(PER_KIND);

    const [projects, milestones, actionItems, issues, risks, kpis] =
      await Promise.all([
        this.db.client
          .from('projects')
          .select('id, name')
          .or(
            `name.ilike.${pat},description.ilike.${pat},project_number.ilike.${pat},reference_id.ilike.${pat}`,
          )
          .limit(PER_KIND),
        child('milestones', 'name'),
        child('action_items', 'title'),
        child('issues', 'title'),
        child('risks', 'statement'),
        this.db.client
          .from('kpis')
          .select('id, name')
          .ilike('name', pat)
          .limit(PER_KIND),
      ]);
    const failed =
      projects.error ??
      milestones.error ??
      actionItems.error ??
      issues.error ??
      risks.error ??
      kpis.error;
    if (failed) throw toHttpException(failed, 'search');

    const hits: SearchHit[] = [];
    for (const p of (projects.data ?? []) as Array<{
      id: string;
      name: string;
    }>) {
      hits.push({
        kind: 'project',
        id: p.id,
        label: p.name,
        project_id: null,
        project_name: null,
      });
    }
    const pushChildren = (kind: SearchKind, rows: unknown) => {
      for (const r of (rows ?? []) as unknown as ChildRow[]) {
        hits.push({
          kind,
          id: r.id,
          label: r.label,
          project_id: r.project_id,
          project_name: r.project?.name ?? null,
        });
      }
    };
    pushChildren('milestone', milestones.data);
    pushChildren('action_item', actionItems.data);
    pushChildren('issue', issues.data);
    pushChildren('risk', risks.data);
    for (const k of (kpis.data ?? []) as Array<{ id: string; name: string }>) {
      hits.push({
        kind: 'kpi',
        id: k.id,
        label: k.name,
        project_id: null,
        project_name: null,
      });
    }
    return { query: clean, hits };
  }

  async listSaved(userId: string): Promise<SavedSearch[]> {
    const { data, error } = await this.db.client
      .from('saved_searches')
      .select('id, name, query, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'search.saved.list');
    return data ?? [];
  }

  async addSaved(
    userId: string,
    dto: CreateSavedSearchDto,
  ): Promise<SavedSearch> {
    const { data, error } = await this.db.client
      .from('saved_searches')
      .insert({
        user_id: userId,
        name: dto.name.trim(),
        query: dto.query.trim(),
      })
      .select('id, name, query, created_at')
      .single<SavedSearch>();
    if (error) throw toHttpException(error, 'search.saved.add');
    return data;
  }

  async removeSaved(
    userId: string,
    savedSearchId: string,
  ): Promise<{ deleted: boolean }> {
    const { data, error } = await this.db.client
      .from('saved_searches')
      .delete()
      .eq('user_id', userId)
      .eq('id', savedSearchId)
      .select('id')
      .maybeSingle<{ id: string }>();
    if (error) throw toHttpException(error, 'search.saved.remove');
    if (!data) throw new NotFoundException('Saved search not found.');
    return { deleted: true };
  }
}
