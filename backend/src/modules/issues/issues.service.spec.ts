import { NotFoundException } from '@nestjs/common';
import { IssuesService } from './issues.service';
import type { IssuesRepository } from './issues.repository';
import type { RecordHistoryService } from '../../database/record-history.service';
import { describeProjectScopedContract } from '../../common/testing/project-scoped-contract';

/** Characterization tests over the issue register's normalization + audit. */
describe('IssuesService', () => {
  const PROJECT = 'p-1';
  const ISSUE = 'i-1';
  const USER = 'u-1';

  function build(
    over: {
      updated?: Record<string, unknown> | null;
      removed?: Record<string, unknown> | null;
    } = {},
  ) {
    const mocks = {
      insert: jest.fn().mockResolvedValue({ id: ISSUE }),
      update: jest
        .fn()
        .mockResolvedValue('updated' in over ? over.updated : { id: ISSUE }),
      remove: jest
        .fn()
        .mockResolvedValue(
          'removed' in over
            ? over.removed
            : { id: ISSUE, label: 'Gate OCR misreads' },
        ),
      logDeleted: jest.fn().mockResolvedValue(undefined),
    };
    const service = new IssuesService(
      mocks as unknown as IssuesRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
    );
    return { service, mocks };
  }

  describe('add', () => {
    it('trims the title, defaults status open, collapses blank text to null', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        {
          title: '  Gate OCR misreads prefixes ',
          description: '   ',
          recommendation: '',
          reported_by: '  Mariam ',
          tags: [],
        },
        USER,
      );
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Gate OCR misreads prefixes',
          status: 'open',
          description: null,
          recommendation: null,
          reported_by: 'Mariam',
          tags: null,
          created_by: USER,
          updated_by: USER,
        }),
      );
    });

    it('empty date_closed becomes null, a real one passes through', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        { title: 'x', date_closed: '', status: 'closed' },
        USER,
      );
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ date_closed: null, status: 'closed' }),
      );
    });
  });

  describe('update', () => {
    it('patches only the fields that were sent', async () => {
      const { service, mocks } = build();
      await service.update(
        PROJECT,
        ISSUE,
        { status: 'closed', resolution: ' Camera repositioned ' },
        USER,
      );
      expect(mocks.update).toHaveBeenCalledWith(PROJECT, ISSUE, {
        updated_by: USER,
        status: 'closed',
        resolution: 'Camera repositioned',
      });
    });

    it('clears a nullable lookup with an explicit null', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, ISSUE, { level_id: null }, USER);
      expect(mocks.update).toHaveBeenCalledWith(PROJECT, ISSUE, {
        updated_by: USER,
        level_id: null,
      });
    });

    it('404s when the issue is not in this project', async () => {
      const { service } = build({ updated: null });
      await expect(
        service.update(PROJECT, ISSUE, { title: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('audits with the deleted row label; 404s cleanly on foreign ids', async () => {
      const ok = build();
      await expect(ok.service.remove(PROJECT, ISSUE, USER)).resolves.toEqual({
        deleted: true,
      });
      expect(ok.mocks.logDeleted).toHaveBeenCalledWith(
        expect.objectContaining({
          table: 'issues',
          label: 'Gate OCR misreads',
        }),
      );

      const missing = build({ removed: null });
      await expect(
        missing.service.remove(PROJECT, ISSUE, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(missing.mocks.logDeleted).not.toHaveBeenCalled();
    });
  });

  // The contract every project-scoped module shares (REFACTOR-PLAN v2, B4).
  describeProjectScopedContract('issues', {
    build: () => build(),
    update: (s) => s.update(PROJECT, ISSUE, {}, USER),
    remove: (s) => s.remove(PROJECT, ISSUE, USER),
    foreignId: (m) => {
      m.update.mockResolvedValue(null);
      m.remove.mockResolvedValue(null);
    },
    audit: (m) => m.logDeleted,
  });
});
