import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import type { AttachmentsRepository } from './attachments.repository';
import type { RecordHistoryService } from '../../database/record-history.service';

/**
 * Characterization tests. The load-bearing behavior here is the storage
 * lifecycle: objects are uploaded before rows are inserted, and on delete the
 * object goes before the row — the opposite order orphans files invisibly.
 * Parent scoping (task-level attachments) has no FK, so its validation lives
 * in this service too.
 */
describe('AttachmentsService', () => {
  const PROJECT = 'p-1';
  const ATT = 'a-1';
  const USER = 'u-1';

  const file = (over: Record<string, unknown> = {}) => ({
    originalname: 'berthing plan.pdf',
    mimetype: 'application/pdf',
    size: 1024,
    buffer: Buffer.from('x'),
    ...over,
  });

  const attRow = (n: string) => ({
    id: `att-${n}`,
    file_name: `file-${n}.pdf`,
    storage_path: `${PROJECT}/path-${n}`,
  });

  function build(
    over: {
      found?: Record<string, unknown> | null;
      parentExists?: boolean;
      byParent?: Array<Record<string, unknown>>;
    } = {},
  ) {
    const mocks = {
      findByProject: jest.fn().mockResolvedValue(over.byParent ?? []),
      findDetail: jest
        .fn()
        .mockResolvedValue('found' in over ? over.found : { id: ATT }),
      findOne: jest
        .fn()
        .mockResolvedValue(
          'found' in over
            ? over.found
            : { id: ATT, storage_path: 'sp', file_name: 'f.pdf' },
        ),
      insert: jest.fn().mockResolvedValue({ id: ATT }),
      update: jest.fn().mockResolvedValue({ id: ATT }),
      removeRow: jest.fn().mockResolvedValue(undefined),
      uploadObject: jest.fn().mockResolvedValue(undefined),
      removeObject: jest.fn().mockResolvedValue(undefined),
      signedUrl: jest.fn().mockResolvedValue('https://signed'),
      parentExists: jest.fn().mockResolvedValue(over.parentExists ?? true),
      logDeleted: jest.fn().mockResolvedValue(undefined),
    };
    const service = new AttachmentsService(
      mocks as unknown as AttachmentsRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
    );
    return { service, mocks };
  }

  describe('create', () => {
    it('uploads the object BEFORE inserting the row', async () => {
      const { service, mocks } = build();
      await service.create(PROJECT, file(), {}, USER);

      expect(mocks.uploadObject.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.insert.mock.invocationCallOrder[0],
      );
      const calls = mocks.insert.mock.calls as unknown as Array<
        [Record<string, unknown>]
      >;
      const row = calls[0][0];
      expect(row.file_name).toBe('berthing plan.pdf');
      expect(String(row.storage_path)).toMatch(/^p-1\//);
      expect(row.uploaded_by).toBe(USER);
    });

    it('sanitizes the storage key but preserves the display file name', async () => {
      const { service, mocks } = build();
      await service.create(
        PROJECT,
        file({ originalname: 'quay wall §final§.pdf' }),
        {},
        USER,
      );
      const calls = mocks.insert.mock.calls as unknown as Array<
        [Record<string, unknown>]
      >;
      const row = calls[0][0];
      expect(row.file_name).toBe('quay wall §final§.pdf');
      expect(String(row.storage_path)).not.toContain('§');
      expect(String(row.storage_path)).not.toContain(' ');
    });

    it('rejects a missing file and oversized uploads before touching storage', async () => {
      const { service, mocks } = build();
      await expect(
        service.create(PROJECT, undefined, {}, USER),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        service.create(PROJECT, file({ size: 101 * 1024 * 1024 }), {}, USER),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(mocks.uploadObject).not.toHaveBeenCalled();
    });

    it('coerces form-data strings: is_gold truthiness and comma-split tags', async () => {
      const { service, mocks } = build();
      await service.create(
        PROJECT,
        file(),
        { is_gold: '1', tags: ' capex , , marine ' },
        USER,
      );
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({ is_gold: true, tags: ['capex', 'marine'] }),
      );
    });

    it('requires parent_type and parent_id together, from the allowed set', async () => {
      const { service } = build();
      await expect(
        service.create(PROJECT, file(), { parent_type: 'action_item' }, USER),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        service.create(
          PROJECT,
          file(),
          { parent_type: 'sticky_note', parent_id: 'x' },
          USER,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('verifies the polymorphic parent exists (no FK backs it)', async () => {
      const { service, mocks } = build({ parentExists: false });
      await expect(
        service.create(
          PROJECT,
          file(),
          { parent_type: 'action_item', parent_id: 'ai-1' },
          USER,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(mocks.uploadObject).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the storage object BEFORE the row, then audits', async () => {
      const { service, mocks } = build();
      await expect(service.remove(PROJECT, ATT, USER)).resolves.toEqual({
        deleted: true,
      });
      expect(mocks.removeObject.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.removeRow.mock.invocationCallOrder[0],
      );
      expect(mocks.logDeleted).toHaveBeenCalledWith(
        expect.objectContaining({ table: 'attachments', label: 'f.pdf' }),
      );
    });

    it('404s without touching storage when the row is not in this project', async () => {
      const { service, mocks } = build({ found: null });
      await expect(service.remove(PROJECT, ATT, USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mocks.removeObject).not.toHaveBeenCalled();
    });
  });

  describe('removeByParent (task-delete cascade)', () => {
    it('removes object then row then audit entry, per attachment', async () => {
      const { service, mocks } = build({
        byParent: [attRow('1'), attRow('2')],
      });
      await service.removeByParent(
        PROJECT,
        { type: 'action_item', id: 'ai-1' },
        USER,
      );
      expect(mocks.removeObject).toHaveBeenCalledTimes(2);
      expect(mocks.removeRow).toHaveBeenCalledTimes(2);
      expect(mocks.logDeleted).toHaveBeenCalledTimes(2);
      expect(mocks.removeObject.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.removeRow.mock.invocationCallOrder[0],
      );
    });

    it('a stuck file cannot block the rest of the cascade', async () => {
      const { service, mocks } = build({
        byParent: [attRow('1'), attRow('2')],
      });
      mocks.removeObject.mockRejectedValueOnce(new Error('locked'));
      await expect(
        service.removeByParent(
          PROJECT,
          { type: 'action_item', id: 'ai-1' },
          USER,
        ),
      ).resolves.toBeUndefined();
      // Second attachment still fully processed.
      expect(mocks.removeRow).toHaveBeenCalledTimes(1);
      expect(mocks.removeRow).toHaveBeenCalledWith(PROJECT, 'att-2');
    });
  });

  describe('reads', () => {
    it('get 404s on a foreign or missing attachment', async () => {
      const { service } = build({ found: null });
      await expect(service.get(PROJECT, ATT)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('download resolves a signed url for the stored path', async () => {
      const { service, mocks } = build();
      await expect(service.getDownloadUrl(PROJECT, ATT)).resolves.toEqual({
        url: 'https://signed',
      });
      expect(mocks.signedUrl).toHaveBeenCalledWith('sp', 'f.pdf');
    });

    it('list validates the optional parent filter pair', () => {
      const { service } = build();
      expect(() => service.list(PROJECT, 'action_item', undefined)).toThrow(
        BadRequestException,
      );
    });
  });
});
