import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import type { SubmissionsRepository } from './submissions.repository';
import type { ProjectsRepository } from '../projects';
import type { MilestonesRepository } from '../milestones';
import type { NotificationsService } from '../notifications';
import type { ProjectAccessService } from '../../common/access/project-access.service';

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 0). These pin what the
 * service does TODAY, including the parts that may look arbitrary. The FR-14
 * workflow is the most rule-dense code in the backend and had no tests.
 *
 * Scope note: repositories are mocked. They wrap the Supabase query builder, so
 * a test of one asserts on a mocked chain rather than on behaviour (see
 * FOLLOW-UPS L1).
 *
 * NOT wired into the B4 conformance suite, on purpose: this module has no
 * `remove`, and its repository `update(id, patch)` is not project-scoped —
 * scoping happens earlier via `findOne(projectId, id)`. Its verbs are a
 * different contract (FOLLOW-UPS L5).
 */
describe('SubmissionsService', () => {
  const PROJECT = 'p-1';
  const SUB = 's-1';
  const USER = 'u-1';
  const PMO = 'u-pmo';
  const OWNER = 'u-owner';

  const OPEN_CYCLE = { id: 'c-1', name: 'August 2026', status: 'open' };
  const CLOSED_CYCLE = { id: 'c-1', name: 'August 2026', status: 'closed' };

  /** A project that passes every mandatory-field check. */
  const completeProject = (over: Record<string, unknown> = {}) => ({
    id: PROJECT,
    name: 'Apollo',
    reference_id: '1.1.1',
    plan_year: 2026,
    owner_id: OWNER,
    sponsor: 'Finance',
    sector_id: 'sec-1',
    target_end_date: '2026-12-31',
    approved_budget: 1000,
    pmo_partner_id: PMO,
    ...over,
  });

  function build(
    over: {
      project?: Record<string, unknown> | null;
      milestones?: Array<{ status: string; weightage: number | null }>;
      cycle?: { id: string; name: string; status: string };
      existing?: Record<string, unknown> | null;
      submission?: Record<string, unknown> | null;
    } = {},
  ) {
    const mocks = {
      // submissions repository
      findByProject: jest.fn().mockResolvedValue([]),
      findByCycle: jest.fn().mockResolvedValue([]),
      findCycleFor: jest.fn().mockResolvedValue(over.cycle ?? OPEN_CYCLE),
      getOrCreateCycleFor: jest
        .fn()
        .mockResolvedValue(over.cycle ?? OPEN_CYCLE),
      setCycleStatus: jest.fn().mockResolvedValue({ id: 'c-1' }),
      findForCycle: jest.fn().mockResolvedValue(over.existing ?? null),
      findOne: jest.fn().mockResolvedValue(
        over.submission === undefined
          ? {
              id: SUB,
              status: 'review',
              submitted_by: USER,
              cycle: over.cycle ?? OPEN_CYCLE,
            }
          : over.submission,
      ),
      insert: jest.fn().mockResolvedValue({ id: SUB, status: 'review' }),
      update: jest.fn().mockResolvedValue({ id: SUB, status: 'updated' }),
      // projects + milestones repositories
      findDetail: jest
        .fn()
        .mockResolvedValue(
          over.project === undefined ? completeProject() : over.project,
        ),
      findAll: jest.fn().mockResolvedValue([]),
      findMilestones: jest.fn().mockResolvedValue(over.milestones ?? []),
      // collaborators
      notify: jest.fn().mockResolvedValue(undefined),
      hiddenProjectIds: jest.fn().mockResolvedValue(new Set<string>()),
    };
    const service = new SubmissionsService(
      mocks as unknown as SubmissionsRepository,
      {
        findDetail: mocks.findDetail,
        findAll: mocks.findAll,
      } as unknown as ProjectsRepository,
      {
        findByProject: mocks.findMilestones,
      } as unknown as MilestonesRepository,
      { notify: mocks.notify } as unknown as NotificationsService,
      {
        hiddenProjectIds: mocks.hiddenProjectIds,
      } as unknown as ProjectAccessService,
    );
    return { service, mocks };
  }

  describe('the submission gate (FDD 3.3.2)', () => {
    it('names every missing mandatory field in one message', async () => {
      const { service } = build({
        project: completeProject({ reference_id: null, sponsor: null }),
      });

      await expect(service.submit(PROJECT, {}, USER)).rejects.toThrow(
        /missing reference ID; missing sponsor/,
      );
    });

    it('treats an empty string as missing but a zero as present', async () => {
      // The check is `value == null || value === ''`, so a zero approved
      // budget is a real value and passes, while a blank sponsor does not.
      const { service } = build({
        project: completeProject({ approved_budget: 0, sponsor: '' }),
      });

      await expect(service.submit(PROJECT, {}, USER)).rejects.toThrow(
        /missing sponsor/,
      );
      await expect(service.submit(PROJECT, {}, USER)).rejects.not.toThrow(
        /approved budget/,
      );
    });

    it('404s when the project does not exist', async () => {
      const { service } = build({ project: null });

      await expect(service.submit(PROJECT, {}, USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('blocks when milestone weights do not total 100', async () => {
      const { service } = build({
        milestones: [
          { status: 'open', weightage: 60 },
          { status: 'open', weightage: 30 },
        ],
      });

      await expect(service.submit(PROJECT, {}, USER)).rejects.toThrow(
        /milestone weights total 90, not 100/,
      );
    });

    it('ignores not_applicable milestones when totalling', async () => {
      const { service, mocks } = build({
        milestones: [
          { status: 'open', weightage: 100 },
          { status: 'not_applicable', weightage: 50 },
        ],
      });

      await service.submit(PROJECT, {}, USER);
      expect(mocks.insert).toHaveBeenCalled();
    });

    it('raises no weight failure at all when the project has no milestones', async () => {
      // The guard is `active.length > 0`, so an unplanned project is not
      // blocked for having nothing to weigh.
      const { service, mocks } = build({ milestones: [] });

      await service.submit(PROJECT, {}, USER);
      expect(mocks.insert).toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    it('creates the first submission in review and notifies the PMO Partner', async () => {
      const { service, mocks } = build();
      await service.submit(PROJECT, { comment: '  ready  ' }, USER);

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          project_id: PROJECT,
          cycle_id: OPEN_CYCLE.id,
          status: 'review',
          comment: 'ready',
          submitted_by: USER,
        }),
      );
      expect(mocks.notify).toHaveBeenCalledWith(
        expect.objectContaining({ userId: PMO, type: 'submission_review' }),
      );
    });

    it('collapses a blank comment to null', async () => {
      const { service, mocks } = build();
      await service.submit(PROJECT, { comment: '   ' }, USER);

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ comment: null }),
      );
    });

    it('resubmits a draft or returned submission instead of inserting', async () => {
      const { service, mocks } = build({
        existing: { id: SUB, status: 'returned' },
      });
      await service.submit(PROJECT, {}, USER);

      expect(mocks.insert).not.toHaveBeenCalled();
      expect(mocks.update).toHaveBeenCalledWith(
        SUB,
        expect.objectContaining({ status: 'review', submitted_by: USER }),
      );
    });

    it('refuses to resubmit one already in flight, naming its status', async () => {
      const { service } = build({ existing: { id: SUB, status: 'validated' } });

      await expect(service.submit(PROJECT, {}, USER)).rejects.toThrow(
        /Already submitted.*\(status: validated\)/,
      );
    });

    it('is blocked while the cycle is closed', async () => {
      const { service } = build({ cycle: CLOSED_CYCLE });

      await expect(service.submit(PROJECT, {}, USER)).rejects.toThrow(
        /cycle is closed/,
      );
    });

    it('reports gate failures before the closed cycle', async () => {
      // Ordering quirk, pinned as-is: the gate runs first, so a project that
      // fails both hears about its fields, not the closed cycle.
      const { service } = build({
        cycle: CLOSED_CYCLE,
        project: completeProject({ sponsor: null }),
      });

      await expect(service.submit(PROJECT, {}, USER)).rejects.toThrow(
        /missing sponsor/,
      );
    });
  });

  describe('transitions', () => {
    it('404s when the submission is not in this project', async () => {
      const { service } = build({ submission: null });

      await expect(
        service.validate(PROJECT, SUB, {}, PMO),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('refuses a transition from the wrong status, naming it', async () => {
      const { service } = build({
        submission: { id: SUB, status: 'draft', cycle: OPEN_CYCLE },
      });

      await expect(service.validate(PROJECT, SUB, {}, PMO)).rejects.toThrow(
        /Cannot validated a submission in status "draft"/,
      );
    });

    it('locks decisions while the cycle is closed', async () => {
      const { service } = build({
        submission: { id: SUB, status: 'review', cycle: CLOSED_CYCLE },
      });

      await expect(service.validate(PROJECT, SUB, {}, PMO)).rejects.toThrow(
        /cycle is closed; decisions are locked/,
      );
    });

    it('lets only the PMO Partner validate', async () => {
      const { service } = build();

      await expect(
        service.validate(PROJECT, SUB, {}, 'someone-else'),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(service.validate(PROJECT, SUB, {}, PMO)).resolves.toEqual({
        id: SUB,
        status: 'updated',
      });
    });

    it('lets anyone validate when the project has no PMO Partner', async () => {
      // Deliberate per the module docblock: the actor gate is enforced only
      // when the project's person field is set.
      const { service } = build({
        project: completeProject({ pmo_partner_id: null }),
      });

      await expect(
        service.validate(PROJECT, SUB, {}, 'someone-else'),
      ).resolves.toBeDefined();
    });

    it('lets only the Project Owner approve', async () => {
      const { service } = build({
        submission: { id: SUB, status: 'validated', cycle: OPEN_CYCLE },
      });

      await expect(
        service.approve(PROJECT, SUB, {}, PMO),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(
        service.approve(PROJECT, SUB, {}, OWNER),
      ).resolves.toBeDefined();
    });

    it('gates neither return nor reject on a specific actor', async () => {
      const { service } = build();

      await expect(
        service.returnSubmission(PROJECT, SUB, {}, 'anyone'),
      ).resolves.toBeDefined();
      await expect(
        service.reject(PROJECT, SUB, {}, 'anyone'),
      ).resolves.toBeDefined();
    });

    it('stamps the returned columns on a rejection, not rejected ones', async () => {
      // Pinned because it is surprising: a rejection is indistinguishable from
      // a return by audit columns alone (FOLLOW-UPS F3).
      const { service, mocks } = build();
      await service.reject(PROJECT, SUB, {}, USER);

      expect(mocks.update).toHaveBeenCalledWith(
        SUB,
        expect.objectContaining({ status: 'rejected', returned_by: USER }),
      );
    });

    it('404s when the row vanishes before the write', async () => {
      const { service, mocks } = build();
      mocks.update.mockResolvedValue(null);

      await expect(
        service.validate(PROJECT, SUB, {}, PMO),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('notifies the owner on validate, the submitter on approve', async () => {
      const { service, mocks } = build();
      await service.validate(PROJECT, SUB, {}, PMO);
      expect(mocks.notify).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: OWNER,
          type: 'submission_validated',
        }),
      );

      const approving = build({
        submission: {
          id: SUB,
          status: 'validated',
          submitted_by: 'u-submitter',
          cycle: OPEN_CYCLE,
        },
      });
      await approving.service.approve(PROJECT, SUB, {}, OWNER);
      expect(approving.mocks.notify).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u-submitter',
          type: 'submission_approved',
        }),
      );
    });

    it('uses the decision comment as the notification body when returning', async () => {
      const { service, mocks } = build();
      await service.returnSubmission(
        PROJECT,
        SUB,
        { comment: '  Fix the budget  ' },
        USER,
      );

      expect(mocks.notify).toHaveBeenCalledWith(
        expect.objectContaining({ body: 'Fix the budget' }),
      );
    });
  });

  describe('cycles', () => {
    it('closes idempotently', async () => {
      const { service, mocks } = build({ cycle: CLOSED_CYCLE });
      await service.closeCurrentCycle();

      expect(mocks.setCycleStatus).not.toHaveBeenCalled();
    });

    it('404s reopening when no cycle exists for the month', async () => {
      const { service, mocks } = build();
      mocks.findCycleFor.mockResolvedValue(null);

      await expect(service.reopenCurrentCycle()).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('reopens without a write when already open', async () => {
      const { service, mocks } = build();
      await service.reopenCurrentCycle();

      expect(mocks.setCycleStatus).not.toHaveBeenCalled();
    });
  });

  describe('cycleStatus', () => {
    it('hides restricted projects the caller cannot see (FR-15)', async () => {
      const { service, mocks } = build();
      mocks.findAll.mockResolvedValue([
        { id: 'p-visible', name: 'Visible' },
        { id: 'p-hidden', name: 'Hidden' },
      ]);
      mocks.hiddenProjectIds.mockResolvedValue(new Set(['p-hidden']));

      const result = await service.cycleStatus(USER);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].project_id).toBe('p-visible');
    });

    it('reports a project with no submission as not_submitted', async () => {
      const { service, mocks } = build();
      mocks.findAll.mockResolvedValue([{ id: PROJECT, name: 'Apollo' }]);

      const result = await service.cycleStatus(USER);
      expect(result.rows[0]).toEqual(
        expect.objectContaining({
          status: 'not_submitted',
          submitted_at: null,
        }),
      );
    });

    it('reports every project as not_submitted when no cycle exists', async () => {
      const { service, mocks } = build();
      mocks.findCycleFor.mockResolvedValue(null);
      mocks.findAll.mockResolvedValue([{ id: PROJECT, name: 'Apollo' }]);

      const result = await service.cycleStatus(USER);
      expect(result.cycle).toBeNull();
      expect(result.rows[0].status).toBe('not_submitted');
      expect(mocks.findByCycle).not.toHaveBeenCalled();
    });
  });
});
