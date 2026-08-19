import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import type { UpdatesRepository } from './updates.repository';
import type { RecordHistoryService } from '../../database/record-history.service';

/** Characterization tests: updates are the activity feed, author-stamped. */
describe('UpdatesService', () => {
  const PROJECT = 'p-1';
  const UPDATE = 'up-1';
  const USER = 'u-1';

  function build(
    over: {
      updated?: Record<string, unknown> | null;
      removed?: Record<string, unknown> | null;
    } = {},
  ) {
    const mocks = {
      findByProject: jest.fn().mockResolvedValue([]),
      insert: jest.fn().mockResolvedValue({ id: UPDATE }),
      update: jest
        .fn()
        .mockResolvedValue('updated' in over ? over.updated : { id: UPDATE }),
      remove: jest
        .fn()
        .mockResolvedValue(
          'removed' in over
            ? over.removed
            : { id: UPDATE, label: 'Checkpoint' },
        ),
      logDeleted: jest.fn().mockResolvedValue(undefined),
    };
    const service = new UpdatesService(
      mocks as unknown as UpdatesRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
    );
    return { service, mocks };
  }

  describe('add', () => {
    it('rejects an empty or whitespace-only body — synchronously', () => {
      const { service } = build();
      // Characterized: add() throws before returning a promise.
      expect(() => service.add(PROJECT, { body: '   ' }, USER)).toThrow(
        BadRequestException,
      );
    });

    it('stamps the caller as author and defaults gold off', async () => {
      const { service, mocks } = build();
      await service.add(PROJECT, { body: ' Steering held. ' }, USER);
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          body: 'Steering held.',
          author_id: USER,
          is_gold: false,
          tags: null,
        }),
      );
    });
  });

  describe('update', () => {
    it('patches only sent fields; empty tags clear the column', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, UPDATE, { tags: [] }, USER);
      expect(mocks.update).toHaveBeenCalledWith(PROJECT, UPDATE, {
        updated_by: USER,
        tags: null,
      });
    });

    it('un-starring reaches the database (is_gold false is not dropped)', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, UPDATE, { is_gold: false }, USER);
      expect(mocks.update).toHaveBeenCalledWith(PROJECT, UPDATE, {
        updated_by: USER,
        is_gold: false,
      });
    });

    it('404s when the update is not in this project', async () => {
      const { service } = build({ updated: null });
      await expect(
        service.update(PROJECT, UPDATE, { body: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('audits the deletion; 404s cleanly on foreign ids', async () => {
      const ok = build();
      await expect(ok.service.remove(PROJECT, UPDATE, USER)).resolves.toEqual({
        deleted: true,
      });
      expect(ok.mocks.logDeleted).toHaveBeenCalledWith(
        expect.objectContaining({ table: 'updates', label: 'Checkpoint' }),
      );

      const missing = build({ removed: null });
      await expect(
        missing.service.remove(PROJECT, UPDATE, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(missing.mocks.logDeleted).not.toHaveBeenCalled();
    });
  });
});
