import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import type { MilestonesRepository } from './milestones.repository';
import type { RecordHistoryService } from '../../database/record-history.service';

/**
 * Characterization tests (REFACTOR-PLAN 2b). These pin what the service does
 * TODAY, including the parts that may look arbitrary.
 *
 * Scope note: the repository is mocked. It is a thin wrapper around the
 * Supabase query builder, so a test of it would assert on a mocked fluent chain
 * rather than on behaviour. Repository query changes are NOT covered here.
 */
describe('MilestonesService', () => {
  const PROJECT = 'p-1';
  const MILESTONE = 'm-1';
  const USER = 'u-1';

  // Mocks are kept as locals and asserted on directly — asserting on
  // `repo.method` would be a method reference on the typed class, which trips
  // @typescript-eslint/unbound-method.
  function build(existing: unknown = { id: MILESTONE, name: 'Cutover' }) {
    const mocks = {
      findByProject: jest.fn().mockResolvedValue([{ id: MILESTONE }]),
      findOne: jest.fn().mockResolvedValue(existing),
      insert: jest.fn().mockResolvedValue({ id: MILESTONE }),
      update: jest.fn().mockResolvedValue({ id: MILESTONE }),
      remove: jest.fn().mockResolvedValue(undefined),
      replaceDependencies: jest.fn().mockResolvedValue(undefined),
      findHistory: jest.fn().mockResolvedValue([{ id: 'h-1' }]),
      logDeleted: jest.fn().mockResolvedValue(undefined),
    };
    const service = new MilestonesService(
      mocks as unknown as MilestonesRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
    );
    return { service, mocks };
  }

  const newMilestone = {
    name: '  Cutover  ',
    start_date: '2026-08-01',
    due_date: '2026-08-31',
    status: 'open' as const,
  };

  describe('add', () => {
    it('freezes original_due_date at the due date it was created with', async () => {
      // The FDD rule the History tab depends on: due_date may slip later, the
      // original never moves. UpdateMilestoneDto deliberately omits the field.
      const { service, mocks } = build();
      await service.add(PROJECT, newMilestone, USER);

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          due_date: '2026-08-31',
          original_due_date: '2026-08-31',
        }),
      );
    });

    it('trims the name and defaults every optional column', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        { ...newMilestone, description: '   ', tags: [] },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith({
        project_id: PROJECT,
        name: 'Cutover',
        description: null,
        start_date: '2026-08-01',
        due_date: '2026-08-31',
        original_due_date: '2026-08-31',
        status: 'open',
        role_id: null,
        owner_id: null,
        is_major: false,
        tags: null,
        weightage: null,
        percent_complete: null,
        outcome_id: null,
        // The creator is written to BOTH columns on insert.
        created_by: USER,
        updated_by: USER,
      });
    });

    it('keeps a zero weightage rather than nulling it', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        { ...newMilestone, weightage: 0, percent_complete: 0 },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ weightage: 0, percent_complete: 0 }),
      );
    });

    it('writes dependencies when the create supplies them', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        { ...newMilestone, depends_on: ['m-9'] },
        USER,
      );

      expect(mocks.replaceDependencies).toHaveBeenCalledWith(
        PROJECT,
        MILESTONE,
        ['m-9'],
      );
    });

    it('skips the dependency write entirely for an empty depends_on', async () => {
      // Not an inconsistency with update(): a freshly inserted row has no
      // dependency rows to clear, so calling replaceDependencies([]) would
      // delete nothing and cost a round-trip. Same end state either way.
      const { service, mocks } = build();
      await service.add(PROJECT, { ...newMilestone, depends_on: [] }, USER);

      expect(mocks.replaceDependencies).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('404s before writing anything', async () => {
      const { service, mocks } = build(null);

      await expect(
        service.update(PROJECT, MILESTONE, { name: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mocks.update).not.toHaveBeenCalled();
    });

    it('patches only the fields that were sent, always stamping updated_by', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, MILESTONE, {}, USER);

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, MILESTONE, {
        updated_by: USER,
      });
    });

    it('passes dates and status straight through, and keeps is_major false', async () => {
      const { service, mocks } = build();
      await service.update(
        PROJECT,
        MILESTONE,
        {
          due_date: '2026-09-30',
          status: 'closed_completed',
          is_major: false,
          weightage: 0,
        },
        USER,
      );

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, MILESTONE, {
        updated_by: USER,
        due_date: '2026-09-30',
        status: 'closed_completed',
        is_major: false,
        weightage: 0,
      });
    });

    it('clears the dependency set when depends_on is explicitly empty', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, MILESTONE, { depends_on: [] }, USER);

      expect(mocks.replaceDependencies).toHaveBeenCalledWith(
        PROJECT,
        MILESTONE,
        [],
      );
      // depends_on is a join table, never a column on the milestone row.
      expect(mocks.update).toHaveBeenCalledWith(PROJECT, MILESTONE, {
        updated_by: USER,
      });
    });

    it('leaves dependencies alone when depends_on is absent', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, MILESTONE, { name: 'Renamed' }, USER);

      expect(mocks.replaceDependencies).not.toHaveBeenCalled();
    });

    it('returns the re-fetched joined row, not the update result', async () => {
      const { service, mocks } = build();
      mocks.findOne.mockResolvedValue({ id: MILESTONE, name: 'Joined' });

      await expect(
        service.update(PROJECT, MILESTONE, { name: 'Joined' }, USER),
      ).resolves.toEqual({ id: MILESTONE, name: 'Joined' });
      expect(mocks.update.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.findOne.mock.invocationCallOrder[1],
      );
    });
  });

  describe('adjustWeights', () => {
    it('rejects a set that does not total exactly 100', async () => {
      const { service, mocks } = build();

      await expect(
        service.adjustWeights(
          PROJECT,
          {
            weights: [
              { id: 'a', weightage: 60 },
              { id: 'b', weightage: 30 },
            ],
          },
          USER,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(mocks.update).not.toHaveBeenCalled();
    });

    it('accepts a set that totals 100', async () => {
      const { service, mocks } = build();
      await service.adjustWeights(
        PROJECT,
        {
          weights: [
            { id: 'a', weightage: 60 },
            { id: 'b', weightage: 40 },
          ],
        },
        USER,
      );

      expect(mocks.update).toHaveBeenCalledTimes(2);
      expect(mocks.update).toHaveBeenCalledWith(PROJECT, 'a', {
        weightage: 60,
        updated_by: USER,
      });
    });

    it('tolerates floating-point drift within 0.001', async () => {
      const { service } = build();

      await expect(
        service.adjustWeights(
          PROJECT,
          {
            weights: [
              { id: 'a', weightage: 33.333 },
              { id: 'b', weightage: 33.333 },
              { id: 'c', weightage: 33.334 },
            ],
          },
          USER,
        ),
      ).resolves.toBeDefined();
    });

    it('allows clearing every weight, which means equal weighting (F1)', async () => {
      const { service, mocks } = build();
      await service.adjustWeights(
        PROJECT,
        {
          weights: [
            { id: 'a', weightage: null },
            { id: 'b', weightage: null },
          ],
        },
        USER,
      );

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, 'a', {
        weightage: null,
        updated_by: USER,
      });
    });

    it('writes nothing for an empty weights array but still returns the list', async () => {
      const { service, mocks } = build();

      await expect(
        service.adjustWeights(PROJECT, { weights: [] }, USER),
      ).resolves.toEqual([{ id: MILESTONE }]);
      expect(mocks.update).not.toHaveBeenCalled();
    });
  });

  describe('history and remove', () => {
    it('checks project ownership before reading history', async () => {
      const { service, mocks } = build(null);

      await expect(service.history(PROJECT, MILESTONE)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mocks.findHistory).not.toHaveBeenCalled();
    });

    it('audits the delete with the name read before it', async () => {
      const { service, mocks } = build();

      await expect(service.remove(PROJECT, MILESTONE, USER)).resolves.toEqual({
        deleted: true,
      });
      expect(mocks.logDeleted).toHaveBeenCalledWith({
        table: 'milestones',
        recordId: MILESTONE,
        projectId: PROJECT,
        label: 'Cutover',
        userId: USER,
      });
      expect(mocks.remove.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.logDeleted.mock.invocationCallOrder[0],
      );
    });

    it('deletes nothing when the milestone is not in this project', async () => {
      const { service, mocks } = build(null);

      await expect(
        service.remove(PROJECT, MILESTONE, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mocks.remove).not.toHaveBeenCalled();
      expect(mocks.logDeleted).not.toHaveBeenCalled();
    });
  });
});
