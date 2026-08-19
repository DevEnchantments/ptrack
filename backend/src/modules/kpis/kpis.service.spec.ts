import { NotFoundException } from '@nestjs/common';
import { KpisService } from './kpis.service';
import type { KpisRepository } from './kpis.repository';

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 0). These pin what the
 * service does TODAY, including the parts that may look arbitrary.
 *
 * Outside the B4 conformance suite on purpose: KPIs are portfolio-level, not
 * project-scoped, so `update(kpiId, …)` has no project to be foreign to. The
 * contract it should have is its own — see FOLLOW-UPS F9 for the gap this
 * suite documents in its child resources.
 */
describe('KpisService', () => {
  const KPI = 'k-1';
  const PLAN = 'pl-1';
  const READING = 'rd-1';
  const USER = 'u-1';

  function build(over: { kpi?: unknown } = {}) {
    const mocks = {
      findAll: jest.fn().mockResolvedValue([{ id: KPI }]),
      findOne: jest
        .fn()
        .mockResolvedValue(over.kpi === undefined ? { id: KPI } : over.kpi),
      insert: jest.fn().mockResolvedValue({ id: KPI }),
      update: jest.fn().mockResolvedValue({ id: KPI }),
      remove: jest.fn().mockResolvedValue({ id: KPI }),
      insertReading: jest.fn().mockResolvedValue({ id: READING }),
      removeReading: jest.fn().mockResolvedValue(undefined),
      insertPlan: jest.fn().mockResolvedValue({ id: PLAN }),
      updatePlan: jest.fn().mockResolvedValue(undefined),
      removePlan: jest.fn().mockResolvedValue(undefined),
    };
    const service = new KpisService(mocks as unknown as KpisRepository);
    return { service, mocks };
  }

  describe('add', () => {
    it('applies every default the KPI registry expects', async () => {
      const { service, mocks } = build();
      await service.add({ name: '  Uptime  ' }, USER);

      expect(mocks.insert).toHaveBeenCalledWith({
        name: 'Uptime',
        description: null,
        pillar: null,
        entity: null,
        unit: null,
        polarity: 'higher_is_better',
        decimal_places: 0,
        data_source: null,
        calculation_method: null,
        frequency: 'monthly',
        rationale: null,
        baseline: null,
        target: null,
        is_priority: false,
        tier_id: null,
        objective_id: null,
        owner_id: null,
        project_id: null,
        created_by: USER,
        updated_by: USER,
      });
    });

    it('keeps a zero baseline, target and decimal_places', async () => {
      // `?? null` and `?? 0`, so a zero is a real value. A KPI whose baseline
      // is genuinely 0 is the normal case, not a blank.
      const { service, mocks } = build();
      await service.add(
        { name: 'Incidents', baseline: 0, target: 0, decimal_places: 0 },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ baseline: 0, target: 0, decimal_places: 0 }),
      );
    });

    it('keeps a lower_is_better polarity', async () => {
      const { service, mocks } = build();
      await service.add(
        { name: 'Incidents', polarity: 'lower_is_better' },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ polarity: 'lower_is_better' }),
      );
    });
  });

  describe('get / list', () => {
    it('404s when the KPI does not exist', async () => {
      const { service } = build({ kpi: null });
      await expect(service.get(KPI)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('hands the list straight back', async () => {
      const { service } = build();
      await expect(service.list()).resolves.toEqual([{ id: KPI }]);
    });
  });

  describe('update', () => {
    it('stamps updated_by and a hand-set updated_at on every patch', async () => {
      // No moddatetime trigger on this table, as with program_outcomes.
      const { service, mocks } = build();
      await service.update(KPI, {}, USER);

      expect(mocks.update).toHaveBeenCalledWith(KPI, {
        updated_by: USER,
        updated_at: expect.any(String) as string,
      });
    });

    it('patches only the fields that were sent', async () => {
      const { service, mocks } = build();
      await service.update(
        KPI,
        { name: '  Renamed  ', is_priority: false },
        USER,
      );

      expect(mocks.update).toHaveBeenCalledWith(KPI, {
        updated_by: USER,
        updated_at: expect.any(String) as string,
        name: 'Renamed',
        is_priority: false,
      });
    });

    it('passes decimal_places through, including zero', async () => {
      // The service reads `dto.decimal_places ?? 0`, but the `?? 0` is dead:
      // the DTO types the field `number | undefined` and the enclosing guard
      // is `!== undefined`, so null never arrives. Pinning the reachable
      // behaviour only (FOLLOW-UPS D3).
      const { service, mocks } = build();
      await service.update(KPI, { decimal_places: 0 }, USER);

      expect(mocks.update).toHaveBeenCalledWith(
        KPI,
        expect.objectContaining({ decimal_places: 0 }),
      );
    });

    it('404s when the KPI does not exist', async () => {
      const { service, mocks } = build();
      mocks.update.mockResolvedValue(null);

      await expect(service.update(KPI, {}, USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('404s when the KPI does not exist', async () => {
      const { service, mocks } = build();
      mocks.remove.mockResolvedValue(null);

      await expect(service.remove(KPI)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('reports the delete', async () => {
      const { service } = build();
      await expect(service.remove(KPI)).resolves.toEqual({ deleted: true });
    });
  });

  describe('readings', () => {
    it('checks the KPI exists before recording a reading', async () => {
      const { service, mocks } = build({ kpi: null });

      await expect(
        service.addReading(KPI, { reading_date: '2026-08-01', value: 1 }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mocks.insertReading).not.toHaveBeenCalled();
    });

    it('records a zero reading and collapses a blank analysis to null', async () => {
      const { service, mocks } = build();
      await service.addReading(
        KPI,
        { reading_date: '2026-08-01', value: 0, performance_analysis: '   ' },
        USER,
      );

      expect(mocks.insertReading).toHaveBeenCalledWith({
        kpi_id: KPI,
        reading_date: '2026-08-01',
        value: 0,
        performance_analysis: null,
        created_by: USER,
      });
    });

    it('deletes a reading without checking it exists (FOLLOW-UPS F9)', async () => {
      // Pinned as the current behaviour, not endorsed: the repository filters
      // on kpi_id so nothing foreign is touched, but a caller deleting a
      // reading that does not exist is told it worked.
      const { service, mocks } = build();

      await expect(
        service.removeReading(KPI, 'no-such-reading'),
      ).resolves.toBeUndefined();
      expect(mocks.findOne).not.toHaveBeenCalled();
    });
  });

  describe('action plans', () => {
    it('checks the KPI exists before adding a plan', async () => {
      const { service, mocks } = build({ kpi: null });

      await expect(
        service.addPlan(KPI, { description: 'Fix it' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mocks.insertPlan).not.toHaveBeenCalled();
    });

    it('defaults a new plan to open and trims its text', async () => {
      const { service, mocks } = build();
      await service.addPlan(
        KPI,
        { description: '  Fix it  ', owner: '   ' },
        USER,
      );

      expect(mocks.insertPlan).toHaveBeenCalledWith({
        kpi_id: KPI,
        description: 'Fix it',
        owner: null,
        due_date: null,
        status: 'open',
        created_by: USER,
      });
    });

    it('reports ok for a plan update whether or not the plan exists (FOLLOW-UPS F9)', async () => {
      // Same class as removeReading: no existence check, no 404, and the
      // repository returns void, so a typo'd plan id is silently a success.
      const { service, mocks } = build();

      await expect(
        service.updatePlan(KPI, 'no-such-plan', { status: 'done' }),
      ).resolves.toEqual({ ok: true });
      expect(mocks.updatePlan).toHaveBeenCalledWith(KPI, 'no-such-plan', {
        status: 'done',
      });
    });

    it('leaves a blank plan description as an empty string, not null', async () => {
      // Unlike every other text field in the module, which collapse to null.
      const { service, mocks } = build();
      await service.updatePlan(KPI, PLAN, { description: '   ' });

      expect(mocks.updatePlan).toHaveBeenCalledWith(KPI, PLAN, {
        description: '',
      });
    });

    it('reports deleted for a plan removal that matched nothing (FOLLOW-UPS F9)', async () => {
      const { service } = build();

      await expect(service.removePlan(KPI, 'no-such-plan')).resolves.toEqual({
        deleted: true,
      });
    });
  });
});
