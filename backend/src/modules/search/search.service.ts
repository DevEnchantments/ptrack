import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import { ProjectAccessService } from '../../common/access/project-access.service';
import {
  SearchRepository,
  type ChildRow,
  type NamedRow,
  type SavedSearch,
} from './search.repository';

export type { SavedSearch } from './search.repository';

export type SearchKind =
  'project' | 'milestone' | 'action_item' | 'issue' | 'risk' | 'kpi';

export interface SearchHit {
  kind: SearchKind;
  id: string;
  label: string;
  project_id: string | null;
  project_name: string | null;
}

const PER_KIND = 8;

/** Below this many characters a search matches too much to be useful. */
const MIN_QUERY_LENGTH = 2;

/** Project-scoped tables and the single column each is searched on. */
const CHILD_KINDS: Array<[SearchKind, string, string]> = [
  ['milestone', 'milestones', 'name'],
  ['action_item', 'action_items', 'title'],
  ['issue', 'issues', 'title'],
  ['risk', 'risks', 'statement'],
];

/**
 * Strips characters that would break PostgREST's or-filter syntax, collapses
 * whitespace, and escapes ilike wildcards so a user searching for "50%" gets
 * literal matches rather than everything.
 */
function toPattern(query: string): { clean: string; pattern: string } {
  const clean = (query ?? '')
    .trim()
    .replace(/[,()"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { clean, pattern: `%${clean.replace(/[%_]/g, (m) => `\\${m}`)}%` };
}

/**
 * Global record search (original-app roadmap). Case-insensitive substring match
 * per kind, capped at PER_KIND hits each, all kinds queried in parallel. Not
 * full-text: update and comment bodies are deliberately out of scope for v1.
 */
@Injectable()
export class SearchService {
  constructor(
    private readonly repo: SearchRepository,
    private readonly access: ProjectAccessService,
  ) {}

  async search(
    q: string,
    userId: string,
  ): Promise<{ query: string; hits: SearchHit[] }> {
    const { clean, pattern } = toPattern(q);
    if (clean.length < MIN_QUERY_LENGTH) return { query: clean, hits: [] };

    const [projects, kpis, ...children] = await Promise.all([
      this.repo.searchProjects(pattern, PER_KIND),
      this.repo.searchKpis(pattern, PER_KIND),
      ...CHILD_KINDS.map(([, table, column]) =>
        this.repo.searchChildren(table, column, pattern, PER_KIND),
      ),
    ]);

    const hits: SearchHit[] = [
      ...topLevelHits('project', projects),
      ...children.flatMap((rows, i) => childHits(CHILD_KINDS[i][0], rows)),
      ...topLevelHits('kpi', kpis),
    ];
    return { query: clean, hits: await this.visibleTo(userId, hits) };
  }

  /**
   * FR-15: drop hits from restricted projects the caller cannot see —
   * including the project rows themselves, which carry their id rather than a
   * project_id.
   */
  private async visibleTo(
    userId: string,
    hits: SearchHit[],
  ): Promise<SearchHit[]> {
    const hidden = await this.access.hiddenProjectIds(userId);
    if (hidden.size === 0) return hits;
    return hits.filter(
      (h) =>
        !(h.project_id && hidden.has(h.project_id)) &&
        !(h.kind === 'project' && hidden.has(h.id)),
    );
  }

  listSaved(userId: string): Promise<SavedSearch[]> {
    return this.repo.listSaved(userId);
  }

  addSaved(userId: string, dto: CreateSavedSearchDto): Promise<SavedSearch> {
    return this.repo.insertSaved(userId, dto.name.trim(), dto.query.trim());
  }

  async removeSaved(
    userId: string,
    savedSearchId: string,
  ): Promise<{ deleted: boolean }> {
    const deleted = await this.repo.deleteSaved(userId, savedSearchId);
    if (!deleted) throw new NotFoundException('Saved search not found.');
    return { deleted: true };
  }
}

/** Projects and KPIs have no parent, so they carry no project columns. */
function topLevelHits(kind: SearchKind, rows: NamedRow[]): SearchHit[] {
  return rows.map((r) => ({
    kind,
    id: r.id,
    label: r.name,
    project_id: null,
    project_name: null,
  }));
}

function childHits(kind: SearchKind, rows: ChildRow[]): SearchHit[] {
  return rows.map((r) => ({
    kind,
    id: r.id,
    label: r.label,
    project_id: r.project_id,
    project_name: r.project?.name ?? null,
  }));
}
