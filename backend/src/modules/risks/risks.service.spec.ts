import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RisksService } from './risks.service';
import type { RisksRepository } from './risks.repository';
import type { RecordHistoryService } from '../../database/record-history.service';
import type { NotificationsService } from '../notifications';
import type { ProjectsRepository } from '../projects';
import type { ProjectAccessService } from '../../common/access/project-access.service';
import { describeProjectScopedContract } from '../../common/testing/project-scoped-contract';

/**
 * Characterization tests: they pin what the service does TODAY. The
 * high-severity alert (FDD 3.9) is the subtlest logic here — threshold,
 * once-per-risk dedup, recipient set, and its best-effort contract.
 *
 * Scope note: the repository is mocked; repository query changes are NOT
 * covered here.
 */
describe('RisksService', () => {
  const PROJECT = 'p-1';
  const RISK = 'r-1';
  const USER = 'u-1';

  const HIGH = { sort_order: 3 };
  const LOW = { sort_order: 1 };

  const riskRow = (over: Record<string, unknown> = {}) => ({
    id: RISK,
    project_id: PROJECT,
    statement: 'Crane erection window missed',
    status: 'open',
    type: 'risk',
    owner_id: null,
    probability: HIGH,
    impact: HIGH,
    ...over,
  });

  function build(
    over: {
      inserted?: Record<string, unknown>;
      updated?: Record<string, unknown> | null;
      level?: number;
      existing?: Record<string, unknown> | null;
      alertSeen?: boolean;
      project?: Record<string, unknown> | null;
    } = {},
  ) {
    const mocks = {
      findByProject: jest.fn().mockResolvedValue([{ id: RISK }]),
      insert: jest.fn().mockResolvedValue(over.inserted ?? riskRow()),
      update: jest
        .fn()
        .mockResolvedValue('updated' in over ? over.updated : riskRow()),
      remove: jest
        .fn()
        .mockResolvedValue(
          'existing' in over && over.existing === null
            ? null
            : { id: RISK, label: 'Crane erection window missed' },
        ),
      findOne: jest
        .fn()
        .mockResolvedValue('existing' in over ? over.existing : riskRow()),
      logDeleted: jest.fn().mockResolvedValue(undefined),
      notify: jest.fn().mockResolvedValue(undefined),
      hasAnyOfType: jest.fn().mockResolvedValue(over.alertSeen ?? false),
      findDetail: jest.fn().mockResolvedValue(
        'project' in over
          ? over.project
          : {
              name: 'Khalifa Port',
              project_manager_id: 'pm-1',
              owner_id: 'own-1',
            },
      ),
      levelFor: jest.fn().mockResolvedValue(over.level ?? 3),
    };
    const service = new RisksService(
      mocks as unknown as RisksRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
      {
        notify: mocks.notify,
        hasAnyOfType: mocks.hasAnyOfType,
      } as unknown as NotificationsService,
      { findDetail: mocks.findDetail } as unknown as ProjectsRepository,
      { levelFor: mocks.levelFor } as unknown as ProjectAccessService,
    );
    return { service, mocks };
  }

  const newRisk = { statement: '  Crane erection window missed  ' };

  describe('add', () => {
    it('trims the statement and defaults status/type', async () => {
      const { service, mocks } = build();
      await service.add(PROJECT, newRisk, USER);

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          project_id: PROJECT,
          statement: 'Crane erection window missed',
          status: 'open',
          type: 'risk',
          created_by: USER,
          updated_by: USER,
        }),
      );
    });

    it('keeps a supplied status and type instead of the defaults', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        { ...newRisk, status: 'closed', type: 'issue' },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'closed', type: 'issue' }),
      );
    });

    it('collapses blank optional text to null', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        { ...newRisk, identified_by: '   ', response_plan: '' },
        USER,
      );
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ identified_by: null, response_plan: null }),
      );
    });
  });

  describe('high-severity alert (FDD 3.9)', () => {
    it('alerts PM and owner once for an open risk scoring >= 6', async () => {
      const { service, mocks } = build();
      await service.add(PROJECT, newRisk, USER);

      expect(mocks.hasAnyOfType).toHaveBeenCalledWith(`risk_high:${RISK}`);
      expect(mocks.notify).toHaveBeenCalledTimes(2);
      expect(mocks.notify).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'pm-1' }),
      );
      expect(mocks.notify).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'own-1' }),
      );
      expect(mocks.notify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: `risk_high:${RISK}`,
          actorId: USER,
          projectId: PROJECT,
        }),
      );
    });

    it('deduplicates recipients when PM and owner are the same person', async () => {
      const { service, mocks } = build({
        project: { name: 'P', project_manager_id: 'pm-1', owner_id: 'pm-1' },
      });
      await service.add(PROJECT, newRisk, USER);
      expect(mocks.notify).toHaveBeenCalledTimes(1);
    });

    it('stays silent below the threshold, when closed, or when unscored', async () => {
      for (const inserted of [
        riskRow({ probability: LOW, impact: LOW }),
        riskRow({ status: 'closed' }),
        riskRow({ probability: null }),
      ]) {
        const { service, mocks } = build({ inserted });
        await service.add(PROJECT, newRisk, USER);
        expect(mocks.notify).not.toHaveBeenCalled();
      }
    });

    it('fires only once per risk — the notification type is the dedup key', async () => {
      const { service, mocks } = build({ alertSeen: true });
      await service.add(PROJECT, newRisk, USER);
      expect(mocks.notify).not.toHaveBeenCalled();
    });

    it('is best-effort: an alert failure never fails the save', async () => {
      const { service, mocks } = build();
      mocks.hasAnyOfType.mockRejectedValue(new Error('table missing'));
      await expect(service.add(PROJECT, newRisk, USER)).resolves.toBeDefined();
    });
  });

  describe('update', () => {
    it('passes status and type through to the write', async () => {
      // Status decides whether the high-severity alert fires, so a column spec
      // that quietly dropped it would be consequential. Nothing pinned that
      // before.
      const { service, mocks } = build();
      await service.update(
        PROJECT,
        RISK,
        { status: 'closed', type: 'issue' },
        USER,
      );

      expect(mocks.update).toHaveBeenCalledWith(
        PROJECT,
        RISK,
        expect.objectContaining({ status: 'closed', type: 'issue' }),
      );
    });

    it('patches only the fields that were sent, stamping updated_by and updated_at', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, RISK, { statement: ' New ' }, USER);

      const calls = mocks.update.mock.calls as unknown as Array<
        [string, string, Record<string, unknown>]
      >;
      const patch = calls[0][2];
      expect(patch.statement).toBe('New');
      expect(patch.updated_by).toBe(USER);
      expect(typeof patch.updated_at).toBe('string');
      expect(patch).not.toHaveProperty('status');
    });

    it('404s when the risk is not in this project', async () => {
      const { service } = build({ updated: null });
      await expect(
        service.update(PROJECT, RISK, { statement: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lets a view-level caller update ONLY a risk they own (FDD role 4)', async () => {
      const owned = build({
        level: 1,
        existing: riskRow({ owner_id: USER }),
      });
      await expect(
        owned.service.update(PROJECT, RISK, { statement: 'x' }, USER),
      ).resolves.toBeDefined();

      const notOwned = build({
        level: 1,
        existing: riskRow({ owner_id: 'someone-else' }),
      });
      await expect(
        notOwned.service.update(PROJECT, RISK, { statement: 'x' }, USER),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('404s the ownership check when the risk does not exist', async () => {
      const { service } = build({ level: 1, existing: null });
      await expect(
        service.update(PROJECT, RISK, { statement: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('runs the high-severity alert on the updated row', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, RISK, { statement: 'x' }, USER);
      expect(mocks.notify).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('audits with the label from the deleted row, after the delete', async () => {
      const { service, mocks } = build();
      await expect(service.remove(PROJECT, RISK, USER)).resolves.toEqual({
        deleted: true,
      });
      expect(mocks.logDeleted).toHaveBeenCalledWith({
        table: 'risks',
        recordId: RISK,
        projectId: PROJECT,
        label: 'Crane erection window missed',
        userId: USER,
      });
      expect(mocks.remove.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.logDeleted.mock.invocationCallOrder[0],
      );
    });

    it('404s and audits nothing when the risk is not in this project', async () => {
      const { service, mocks } = build({ existing: null });
      await expect(service.remove(PROJECT, RISK, USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mocks.logDeleted).not.toHaveBeenCalled();
    });
  });

  // The contract every project-scoped module shares (REFACTOR-PLAN v2, B4).
  describeProjectScopedContract('risks', {
    build: () => build(),
    update: (s) => s.update(PROJECT, RISK, {}, USER),
    remove: (s) => s.remove(PROJECT, RISK, USER),
    foreignId: (m) => {
      m.update.mockResolvedValue(null);
      m.remove.mockResolvedValue(null);
    },
    audit: (m) => m.logDeleted,
  });
});
