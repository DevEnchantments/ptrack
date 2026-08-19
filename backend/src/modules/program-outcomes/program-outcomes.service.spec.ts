import { NotFoundException } from '@nestjs/common';
import { ProgramOutcomesService } from './program-outcomes.service';
import type { ProgramOutcomesRepository } from './program-outcomes.repository';
import type { RecordHistoryService } from '../../database/record-history.service';
import { describeProjectScopedContract } from '../../common/testing/project-scoped-contract';

/**
 * Characterization tests (REFACTOR-PLAN 2a). These pin what the service does
 * TODAY, including the parts that may look arbitrary.
 *
 * Scope note: the repository is mocked. It is a thin wrapper around the
 * Supabase query builder, so a test of it would assert on a mocked fluent chain
 * rather than on behaviour. Repository query changes are NOT covered here.
 */
describe('ProgramOutcomesService', () => {
  const PROJECT = 'p-1';
  const OUTCOME = 'o-1';
  const USER = 'u-1';

  const outcome = (sortOrder: number | null) => ({
    id: `o-${sortOrder}`,
    sort_order: sortOrder,
  });

  // Mocks are kept as locals and asserted on directly — asserting on
  // `repo.method` would be a method reference on the typed class, which trips
  // @typescript-eslint/unbound-method.
  function build(existing: unknown[] = []) {
    const mocks = {
      findByProject: jest.fn().mockResolvedValue(existing),
      insert: jest.fn().mockResolvedValue({ id: OUTCOME }),
      update: jest.fn().mockResolvedValue({ id: OUTCOME }),
      remove: jest.fn().mockResolvedValue({ id: OUTCOME, label: 'Outcome 1' }),
      logDeleted: jest.fn().mockResolvedValue(undefined),
    };
    const service = new ProgramOutcomesService(
      mocks as unknown as ProgramOutcomesRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
    );
    return { service, mocks };
  }

  describe('add', () => {
    it('numbers a new outcome next in the project when none is given', async () => {
      const { service, mocks } = build([outcome(1), outcome(2)]);
      await service.add(PROJECT, { name: 'Outcome 3' }, USER);

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ sort_order: 3 }),
      );
    });

    it('starts at 1 in an empty project', async () => {
      const { service, mocks } = build([]);
      await service.add(PROJECT, { name: 'Outcome 1' }, USER);

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ sort_order: 1 }),
      );
    });

    /**
     * Regression, 2026-08-13: numbering used to be `count + 1`, so deleting
     * outcome 2 of 1-2-3 left a count of 2 and handed the next insert a
     * colliding 3. It takes the highest number in use instead.
     */
    it('does not reuse a number after an earlier outcome is deleted', async () => {
      const { service, mocks } = build([outcome(1), outcome(3)]);
      await service.add(PROJECT, { name: 'Outcome 4' }, USER);

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ sort_order: 4 }),
      );
    });

    it('ignores outcomes with no number when picking the next one', async () => {
      const { service, mocks } = build([outcome(null), outcome(2)]);
      await service.add(PROJECT, { name: 'Outcome 3' }, USER);

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ sort_order: 3 }),
      );
    });

    it('skips the numbering read entirely when a number is supplied', async () => {
      const { service, mocks } = build([outcome(1)]);
      await service.add(PROJECT, { name: 'Outcome 9', sort_order: 9 }, USER);

      expect(mocks.findByProject).not.toHaveBeenCalled();
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ sort_order: 9 }),
      );
    });

    it('trims the name and nulls absent dates', async () => {
      const { service, mocks } = build([]);
      await service.add(PROJECT, { name: '  Outcome 1  ' }, USER);

      expect(mocks.insert).toHaveBeenCalledWith({
        project_id: PROJECT,
        name: 'Outcome 1',
        sort_order: 1,
        start_date: null,
        end_date: null,
        // The creator is written to BOTH columns on insert.
        created_by: USER,
        updated_by: USER,
      });
    });

    it('keeps the dates it is given', async () => {
      const { service, mocks } = build([]);
      await service.add(
        PROJECT,
        { name: 'Outcome 1', start_date: '2026-08-01', end_date: '2026-12-31' },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          start_date: '2026-08-01',
          end_date: '2026-12-31',
        }),
      );
    });
  });

  describe('update', () => {
    it('stamps updated_by and a hand-set updated_at on every patch', async () => {
      // This table has no moddatetime trigger, so the service maintains the
      // audit column itself.
      const { service, mocks } = build();
      await service.update(PROJECT, OUTCOME, {}, USER);

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, OUTCOME, {
        updated_by: USER,
        updated_at: expect.any(String) as string,
      });
    });

    it('patches only the fields that were sent', async () => {
      const { service, mocks } = build();
      await service.update(
        PROJECT,
        OUTCOME,
        { name: '  Renamed  ', sort_order: null },
        USER,
      );

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, OUTCOME, {
        updated_by: USER,
        updated_at: expect.any(String) as string,
        name: 'Renamed',
        sort_order: null,
      });
    });

    it('404s when the outcome is not in this project', async () => {
      const { service, mocks } = build();
      mocks.update.mockResolvedValue(null);

      await expect(
        service.update(PROJECT, OUTCOME, { name: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('404s and writes no audit row when the outcome is not in this project', async () => {
      const { service, mocks } = build();
      mocks.remove.mockResolvedValue(null);

      await expect(
        service.remove(PROJECT, OUTCOME, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mocks.logDeleted).not.toHaveBeenCalled();
    });

    it('audits the delete with the label the repository resolved', async () => {
      const { service, mocks } = build();

      await expect(service.remove(PROJECT, OUTCOME, USER)).resolves.toEqual({
        deleted: true,
      });
      expect(mocks.logDeleted).toHaveBeenCalledWith({
        table: 'program_outcomes',
        recordId: OUTCOME,
        projectId: PROJECT,
        label: 'Outcome 1',
        userId: USER,
      });
    });
  });

  // The contract every project-scoped module shares (REFACTOR-PLAN v2, B4).
  describeProjectScopedContract('program-outcomes', {
    build: () => build(),
    update: (s) => s.update(PROJECT, OUTCOME, {}, USER),
    remove: (s) => s.remove(PROJECT, OUTCOME, USER),
    foreignId: (m) => {
      m.update.mockResolvedValue(null);
      m.remove.mockResolvedValue(null);
    },
    audit: (m) => m.logDeleted,
  });
});
