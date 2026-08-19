import { ReportsService } from './reports.service';
import type { ReportsRepository } from './reports.repository';
import type { ProjectAccessService } from '../../common/access/project-access.service';

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 0). Repository extracted
 * first in the same commit.
 *
 * The formulas themselves (F1/F2/F5) have their own tests in
 * common/formulas.spec.ts. What is pinned here is the reporting layer around
 * them: grouping, the delta rule, sort order, month bucketing, and FR-15.
 *
 * Dates are deliberately in the past so `plannedProgress` reads 100 whenever
 * this suite runs, rather than depending on the clock.
 */
describe('ReportsService', () => {
  const USER = 'u-1';
  const HIDDEN = 'p-hidden';

  const project = (over: Record<string, unknown> = {}) => ({
    id: 'p-1',
    name: 'Apollo',
    reference_id: '1.1',
    start_date: '2020-01-01',
    target_end_date: '2020-12-31',
    status: { name: 'In Progress' },
    owner: null,
    project_manager: null,
    ...over,
  });

  function build(over: { hidden?: string[] } = {}) {
    const mocks = {
      allProjects: jest.fn().mockResolvedValue([project()]),
      allMilestoneProgress: jest.fn().mockResolvedValue([]),
      allMilestoneDates: jest.fn().mockResolvedValue([]),
      submissionsInYear: jest.fn().mockResolvedValue([]),
      hiddenProjectIds: jest.fn().mockResolvedValue(new Set(over.hidden ?? [])),
    };
    const service = new ReportsService(
      mocks as unknown as ReportsRepository,
      {
        hiddenProjectIds: mocks.hiddenProjectIds,
      } as unknown as ProjectAccessService,
    );
    return { service, mocks };
  }

  describe('initiativeProgress', () => {
    it('drops projects the caller cannot see', async () => {
      const { service, mocks } = build({ hidden: [HIDDEN] });
      mocks.allProjects.mockResolvedValue([
        project({ id: 'p-ok' }),
        project({ id: HIDDEN }),
      ]);

      const { rows } = await service.initiativeProgress(USER);
      expect(rows.map((r) => r.project_id)).toEqual(['p-ok']);
    });

    it('falls back from a person’s name to their email', async () => {
      const { service, mocks } = build();
      mocks.allProjects.mockResolvedValue([
        project({
          owner: { full_name: null, email: 'owner@x.com' },
          project_manager: { full_name: 'Dana', email: 'dana@x.com' },
        }),
      ]);

      const [row] = (await service.initiativeProgress(USER)).rows;
      expect(row.owner).toBe('owner@x.com');
      expect(row.project_manager).toBe('Dana');
    });

    it('counts milestones excluding not_applicable', async () => {
      const { service, mocks } = build();
      mocks.allMilestoneProgress.mockResolvedValue([
        {
          project_id: 'p-1',
          status: 'closed_completed',
          weightage: null,
          percent_complete: null,
        },
        {
          project_id: 'p-1',
          status: 'open',
          weightage: null,
          percent_complete: null,
        },
        {
          project_id: 'p-1',
          status: 'not_applicable',
          weightage: null,
          percent_complete: null,
        },
      ]);

      const [row] = (await service.initiativeProgress(USER)).rows;
      expect(row.milestones_total).toBe(2);
      expect(row.milestones_done).toBe(1);
    });

    it('groups milestones by project rather than mixing them', async () => {
      const { service, mocks } = build();
      mocks.allProjects.mockResolvedValue([
        project({ id: 'p-1' }),
        project({ id: 'p-2' }),
      ]);
      mocks.allMilestoneProgress.mockResolvedValue([
        {
          project_id: 'p-1',
          status: 'open',
          weightage: null,
          percent_complete: null,
        },
        {
          project_id: 'p-2',
          status: 'open',
          weightage: null,
          percent_complete: null,
        },
        {
          project_id: 'p-2',
          status: 'open',
          weightage: null,
          percent_complete: null,
        },
      ]);

      const { rows } = await service.initiativeProgress(USER);
      const totals = Object.fromEntries(
        rows.map((r) => [r.project_id, r.milestones_total]),
      );
      expect(totals).toEqual({ 'p-1': 1, 'p-2': 2 });
    });

    it('reports a null delta only when neither number exists', async () => {
      // No milestones and no dates: nothing to compare.
      const { service, mocks } = build();
      mocks.allProjects.mockResolvedValue([
        project({ start_date: null, target_end_date: null }),
      ]);

      const [row] = (await service.initiativeProgress(USER)).rows;
      expect(row.calculated).toBeNull();
      expect(row.planned).toBeNull();
      expect(row.delta).toBeNull();
    });

    it('treats a missing half as zero when the other half exists', async () => {
      const { service, mocks } = build();
      mocks.allProjects.mockResolvedValue([project()]); // planned = 100, past window
      // no milestones -> calculated null

      const [row] = (await service.initiativeProgress(USER)).rows;
      expect(row.planned).toBe(100);
      expect(row.delta).toBe(-100);
    });

    it('sorts worst delta first and puts incomparable projects last', async () => {
      const { service, mocks } = build();
      mocks.allProjects.mockResolvedValue([
        project({ id: 'p-none', start_date: null, target_end_date: null }),
        project({ id: 'p-behind' }),
        project({ id: 'p-ontrack' }),
      ]);
      mocks.allMilestoneProgress.mockResolvedValue([
        {
          project_id: 'p-ontrack',
          status: 'closed_completed',
          weightage: null,
          percent_complete: 100,
        },
      ]);

      const { rows } = await service.initiativeProgress(USER);
      expect(rows.map((r) => r.project_id)).toEqual([
        'p-behind', // delta -100
        'p-ontrack', // delta 0
        'p-none', // null delta sorts last
      ]);
    });
  });

  describe('monthlyPerformance', () => {
    it('always returns twelve labelled months', async () => {
      const { service } = build();
      const { year, months } = await service.monthlyPerformance(2026, USER);

      expect(year).toBe(2026);
      expect(months).toHaveLength(12);
      expect(months[0].label).toBe('Jan');
      expect(months[11].label).toBe('Dec');
    });

    it('counts a milestone as due in the month its due_date falls in', async () => {
      const { service, mocks } = build();
      mocks.allMilestoneDates.mockResolvedValue([
        {
          project_id: 'p-1',
          status: 'open',
          due_date: '2026-03-15',
          completed_date: null,
        },
        {
          project_id: 'p-1',
          status: 'closed_completed',
          due_date: '2026-03-20',
          completed_date: '2026-04-02',
        },
      ]);

      const { months } = await service.monthlyPerformance(2026, USER);
      expect(months[2]).toEqual(
        expect.objectContaining({ label: 'Mar', due: 2, done: 1 }),
      );
    });

    it('counts completion in the month it happened, not the month it was due', async () => {
      // The subtle one: `done` is about the due month, `completed` is about
      // the completion month, and they are different numbers.
      const { service, mocks } = build();
      mocks.allMilestoneDates.mockResolvedValue([
        {
          project_id: 'p-1',
          status: 'closed_completed',
          due_date: '2026-03-20',
          completed_date: '2026-04-02',
        },
      ]);

      const { months } = await service.monthlyPerformance(2026, USER);
      expect(months[2].completed).toBe(0); // March
      expect(months[3].completed).toBe(1); // April
    });

    it('ignores not_applicable milestones entirely', async () => {
      const { service, mocks } = build();
      mocks.allMilestoneDates.mockResolvedValue([
        {
          project_id: 'p-1',
          status: 'not_applicable',
          due_date: '2026-03-15',
          completed_date: '2026-03-16',
        },
      ]);

      const { months } = await service.monthlyPerformance(2026, USER);
      expect(months[2]).toEqual(
        expect.objectContaining({ due: 0, completed: 0 }),
      );
    });

    it('counts submissions and approvals in their cycle month', async () => {
      const { service, mocks } = build();
      mocks.submissionsInYear.mockResolvedValue([
        {
          project_id: 'p-1',
          status: 'approved',
          cycle: { period_start: '2026-05-01' },
        },
        {
          project_id: 'p-1',
          status: 'review',
          cycle: { period_start: '2026-05-01' },
        },
      ]);

      const { months } = await service.monthlyPerformance(2026, USER);
      expect(months[4]).toEqual(
        expect.objectContaining({ submitted: 2, approved: 1 }),
      );
    });

    it('applies FR-15 to both milestones and submissions', async () => {
      const { service, mocks } = build({ hidden: [HIDDEN] });
      mocks.allMilestoneDates.mockResolvedValue([
        {
          project_id: HIDDEN,
          status: 'open',
          due_date: '2026-03-15',
          completed_date: null,
        },
      ]);
      mocks.submissionsInYear.mockResolvedValue([
        {
          project_id: HIDDEN,
          status: 'approved',
          cycle: { period_start: '2026-03-01' },
        },
      ]);

      const { months } = await service.monthlyPerformance(2026, USER);
      expect(months[2]).toEqual(
        expect.objectContaining({ due: 0, submitted: 0, approved: 0 }),
      );
    });

    it('asks the repository only for the year in question', async () => {
      const { service, mocks } = build();
      await service.monthlyPerformance(2026, USER);

      expect(mocks.submissionsInYear).toHaveBeenCalledWith(2026);
    });
  });
});
