import { DashboardService } from './dashboard.service';
import type { DashboardRepository } from './dashboard.repository';
import type { ProjectAccessService } from '../../common/access/project-access.service';

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 0). Repository extracted
 * first in the same commit.
 *
 * The dashboard computes a dozen chart shapes from six tables. These do not
 * pin every series — that would be asserting arithmetic — but they do pin the
 * decisions: what FR-15 hides and what it deliberately does not, what counts
 * as active or overdue, and the shapes the chart components rely on being
 * present.
 *
 * Time is frozen so week and month buckets are deterministic.
 */
describe('DashboardService', () => {
  const USER = 'u-1';
  const HIDDEN = 'p-hidden';
  const NOW = new Date('2026-08-19T12:00:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const source = (over: Record<string, unknown> = {}) => ({
    projects: [],
    milestones: [],
    actionItems: [],
    updates: [],
    history: [],
    submissions: [],
    ...over,
  });

  function build(
    over: { hidden?: string[]; data?: Record<string, unknown> } = {},
  ) {
    const mocks = {
      load: jest.fn().mockResolvedValue(source(over.data ?? {})),
      hiddenProjectIds: jest.fn().mockResolvedValue(new Set(over.hidden ?? [])),
    };
    const service = new DashboardService(
      mocks as unknown as DashboardRepository,
      {
        hiddenProjectIds: mocks.hiddenProjectIds,
      } as unknown as ProjectAccessService,
    );
    return { service, mocks };
  }

  const project = (over: Record<string, unknown> = {}) => ({
    id: 'p-1',
    created_at: '2026-08-01T00:00:00.000Z',
    start_date: '2020-01-01',
    target_end_date: '2020-12-31',
    approved_budget: null,
    utilized_budget: null,
    status: { name: 'In Progress' },
    category: { name: 'Migration' },
    ...over,
  });

  const actionItem = (over: Record<string, unknown> = {}) => ({
    project_id: 'p-1',
    status: 'open',
    due_date: null,
    created_at: '2026-08-18T00:00:00.000Z',
    updated_at: '2026-08-18T00:00:00.000Z',
    ...over,
  });

  it('asks the repository for the window the heatmap and cycle need', async () => {
    const { service, mocks } = build();
    await service.data(USER);

    const [bounds] = mocks.load.mock.calls[0] as [
      { historyFrom: string; today: string },
    ];
    expect(bounds.today).toBe('2026-08-19');
    // Twelve weeks back from the start of this week.
    expect(new Date(bounds.historyFrom).getTime()).toBeLessThan(NOW.getTime());
  });

  describe('FR-15', () => {
    it('excludes hidden projects from every project-keyed number', async () => {
      const { service } = build({
        hidden: [HIDDEN],
        data: {
          projects: [project({ id: 'p-ok' }), project({ id: HIDDEN })],
          actionItems: [
            actionItem({ project_id: 'p-ok' }),
            actionItem({ project_id: HIDDEN }),
          ],
        },
      });

      const data = await service.data(USER);
      expect(data.stats.active_projects).toBe(1);
      expect(data.stats.open_action_items).toBe(1);
    });

    it('deliberately keeps updates and history global', async () => {
      // They carry no project linkage, so they leak nothing nameable — the
      // activity counts stay whole rather than being silently wrong.
      const { service } = build({
        hidden: [HIDDEN],
        data: {
          updates: [{ created_at: '2026-08-18T00:00:00.000Z' }],
          history: [{ changed_at: '2026-08-18T00:00:00.000Z' }],
        },
      });

      const data = await service.data(USER);
      const totalUpdates = data.updates_per_week.reduce(
        (sum, w) => sum + w.value,
        0,
      );
      expect(totalUpdates).toBe(1);
    });
  });

  describe('stat tiles', () => {
    it('counts a project as active unless its status reads as closed', async () => {
      const { service } = build({
        data: {
          projects: [
            project({ id: 'p-1', status: { name: 'In Progress' } }),
            project({ id: 'p-2', status: { name: 'Completed' } }),
            project({ id: 'p-3', status: null }),
          ],
        },
      });

      const data = await service.data(USER);
      expect(data.stats.active_projects).toBe(2);
    });

    it('counts overdue across both action items and milestones', async () => {
      const { service } = build({
        data: {
          actionItems: [actionItem({ due_date: '2026-08-01' })],
          milestones: [
            {
              project_id: 'p-1',
              status: 'open',
              due_date: '2026-08-01',
              completed_date: null,
              is_major: false,
              weightage: null,
              percent_complete: null,
            },
          ],
        },
      });

      const data = await service.data(USER);
      expect(data.stats.overdue_items).toBe(2);
    });

    it('does not count a closed action item as open or overdue', async () => {
      const { service } = build({
        data: {
          actionItems: [
            actionItem({ status: 'closed_completed', due_date: '2026-08-01' }),
          ],
        },
      });

      const data = await service.data(USER);
      expect(data.stats.open_action_items).toBe(0);
      expect(data.stats.overdue_items).toBe(0);
    });

    it('counts only major milestones separately', async () => {
      const { service } = build({
        data: {
          milestones: [
            {
              project_id: 'p-1',
              status: 'open',
              due_date: '2026-08-25',
              completed_date: null,
              is_major: true,
              weightage: null,
              percent_complete: null,
            },
            {
              project_id: 'p-1',
              status: 'open',
              due_date: '2026-08-26',
              completed_date: null,
              is_major: false,
              weightage: null,
              percent_complete: null,
            },
          ],
        },
      });

      const data = await service.data(USER);
      expect(data.stats.milestones_this_month).toBe(2);
      expect(data.stats.major_milestones_this_month).toBe(1);
    });
  });

  describe('shapes the charts depend on', () => {
    it('returns eight weekly buckets and twelve heatmap weeks of five days', async () => {
      const { service } = build();
      const data = await service.data(USER);

      expect(data.updates_per_week).toHaveLength(8);
      expect(data.heat).toHaveLength(12);
      expect(data.heat[0]).toHaveLength(5);
    });

    it('labels unnamed groupings rather than dropping them', async () => {
      const { service } = build({
        data: { projects: [project({ status: null })] },
      });

      const data = await service.data(USER);
      expect(data.projects_by_status).toEqual([{ label: 'Unknown', value: 1 }]);
    });

    it('sums budgets across visible projects only', async () => {
      const { service } = build({
        hidden: [HIDDEN],
        data: {
          projects: [
            project({ id: 'p-ok', approved_budget: 100, utilized_budget: 40 }),
            project({ id: HIDDEN, approved_budget: 900, utilized_budget: 900 }),
          ],
        },
      });

      const data = await service.data(USER);
      expect(data.executive.budget).toEqual({ approved: 100, utilized: 40 });
    });

    it('reports every submission status in a fixed order, zero-filled', async () => {
      const { service } = build({
        data: { submissions: [{ project_id: 'p-1', status: 'approved' }] },
      });

      const data = await service.data(USER);
      expect(data.executive.submissions.map((s) => s.label)).toEqual([
        'review',
        'validated',
        'approved',
        'returned',
        'rejected',
        'draft',
      ]);
      expect(
        data.executive.submissions.find((s) => s.label === 'approved')?.value,
      ).toBe(1);
    });
  });
});
