import { NotFoundException } from '@nestjs/common';
import { ActionItemsService } from './action-items.service';
import type { ActionItemsRepository } from './action-items.repository';
import type { RecordHistoryService } from '../../database/record-history.service';
import type { AttachmentsService } from '../attachments/attachments.service';

/**
 * The owner-diff is the subtlest logic in this service: owners are replaced
 * wholesale on every save (one atomic replace RPC), so the service must log a
 * history entry ONLY when the rendered set actually changed — otherwise every
 * save would fabricate an "Owners changed" entry.
 */
describe('ActionItemsService owner-diff history', () => {
  const PROJECT = 'p-1';
  const ITEM = 'a-1';
  const USER = 'u-1';

  const owner = (slot: number, name: string) => ({
    slot,
    user_id: `u-${name}`,
    profile: { full_name: name, email: `${name}@x.com` },
  });

  // Mocks are kept as locals and asserted on directly — asserting on
  // `repo.method` would be a method reference on the typed class, which trips
  // @typescript-eslint/unbound-method.
  function build(beforeOwners: unknown[], afterOwners: unknown[]) {
    const mocks = {
      // The before-set comes from the initial get; the after-set comes from the
      // update itself, which returns the fully-joined row.
      findOne: jest
        .fn()
        .mockResolvedValue({ id: ITEM, title: 'T', owners: beforeOwners }),
      update: jest
        .fn()
        .mockResolvedValue({ id: ITEM, title: 'T', owners: afterOwners }),
      replaceOwners: jest.fn().mockResolvedValue(undefined),
      insertHistory: jest.fn().mockResolvedValue(undefined),
    };
    const repo = mocks as unknown as ActionItemsRepository;
    const auditLog = {
      logDeleted: jest.fn().mockResolvedValue(undefined),
    } as unknown as RecordHistoryService;
    const attachments = {
      removeByParent: jest.fn().mockResolvedValue(undefined),
    } as unknown as AttachmentsService;
    return {
      service: new ActionItemsService(repo, auditLog, attachments),
      mocks,
    };
  }

  it('logs one Owners entry when the set changes', async () => {
    const { service, mocks } = build(
      [owner(1, 'Dana')],
      [owner(1, 'Dana'), owner(2, 'Sam')],
    );
    await service.update(PROJECT, ITEM, { owner_ids: ['x', 'y'] }, USER);

    expect(mocks.insertHistory).toHaveBeenCalledTimes(1);
    expect(mocks.insertHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        field_label: 'Owners',
        old_value: 'Dana',
        new_value: 'Dana, Sam',
        changed_by: USER,
      }),
    );
  });

  it('logs nothing when the same set is re-saved', async () => {
    const { service, mocks } = build([owner(1, 'Dana')], [owner(1, 'Dana')]);
    await service.update(PROJECT, ITEM, { owner_ids: ['x'] }, USER);

    // The join rows were still replaced (that is how saves work here)…
    expect(mocks.replaceOwners).toHaveBeenCalled();
    // …but no history was fabricated for an unchanged set.
    expect(mocks.insertHistory).not.toHaveBeenCalled();
  });

  it('does not touch owners at all when owner_ids is not in the patch', async () => {
    const { service, mocks } = build([owner(1, 'Dana')], [owner(1, 'Dana')]);
    await service.update(PROJECT, ITEM, { title: 'New title' }, USER);

    expect(mocks.replaceOwners).not.toHaveBeenCalled();
    expect(mocks.insertHistory).not.toHaveBeenCalled();
  });

  it('compares owners in slot order, not array order', async () => {
    const { service, mocks } = build(
      [owner(2, 'Sam'), owner(1, 'Dana')],
      [owner(1, 'Dana'), owner(2, 'Sam')],
    );
    await service.update(PROJECT, ITEM, { owner_ids: ['x', 'y'] }, USER);

    expect(mocks.insertHistory).not.toHaveBeenCalled();
  });
});

/**
 * Characterization tests (REFACTOR-PLAN phase 0b) over the rest of the service.
 * These pin current behaviour, including the parts that may look arbitrary.
 *
 * Scope note: the repository is mocked. It is a thin wrapper around the
 * Supabase query builder, so a test of it would assert on a mocked fluent chain
 * rather than on behaviour. Repository query changes are NOT covered here.
 */
describe('ActionItemsService', () => {
  const PROJECT = 'p-1';
  const ITEM = 'a-1';
  const USER = 'u-1';

  function build(existing: unknown = { id: ITEM, title: 'Draft', owners: [] }) {
    const mocks = {
      insert: jest.fn().mockResolvedValue({ id: ITEM }),
      insertOwners: jest.fn().mockResolvedValue(undefined),
      findOne: jest.fn().mockResolvedValue(existing),
      update: jest.fn().mockResolvedValue({ id: ITEM, owners: [] }),
      replaceOwners: jest.fn().mockResolvedValue(undefined),
      insertHistory: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      findHistory: jest.fn().mockResolvedValue([{ id: 'h-1' }]),
      listComments: jest.fn().mockResolvedValue([{ id: 'c-1' }]),
      insertComment: jest.fn().mockResolvedValue({ id: 'c-2' }),
      logDeleted: jest.fn().mockResolvedValue(undefined),
      removeByParent: jest.fn().mockResolvedValue(undefined),
    };
    const service = new ActionItemsService(
      mocks as unknown as ActionItemsRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
      { removeByParent: mocks.removeByParent } as unknown as AttachmentsService,
    );
    return { service, mocks };
  }

  const newItem = {
    title: '  Draft the rollback plan  ',
    due_date: '2026-08-31',
    status: 'open' as const,
  };

  describe('add', () => {
    it('trims the title and collapses blank text and empty tags to null', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        { ...newItem, description: '   ', tags: [] },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith({
        project_id: PROJECT,
        milestone_id: null,
        title: 'Draft the rollback plan',
        description: null,
        type_id: null,
        role_id: null,
        due_date: '2026-08-31',
        status: 'open',
        tags: null,
        created_by: USER,
        updated_by: USER,
      });
    });

    it('de-duplicates owners and silently caps the set at four slots', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        { ...newItem, owner_ids: ['a', 'a', 'b', 'c', 'd', 'e'] },
        USER,
      );

      // 'e' is dropped without an error: there are only four owner slots.
      expect(mocks.insertOwners).toHaveBeenCalledWith(ITEM, [
        'a',
        'b',
        'c',
        'd',
      ]);
    });

    it('still calls insertOwners with an empty set when no owners are given', async () => {
      const { service, mocks } = build();
      await service.add(PROJECT, newItem, USER);

      expect(mocks.insertOwners).toHaveBeenCalledWith(ITEM, []);
    });
  });

  describe('get', () => {
    it('404s when the item is not in this project', async () => {
      const { service } = build(null);
      await expect(service.get(PROJECT, ITEM)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('patches only the fields that were sent, always stamping updated_by', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, ITEM, {}, USER);

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, ITEM, {
        updated_by: USER,
      });
    });

    it('applies the same de-dupe and four-slot cap as add', async () => {
      const { service, mocks } = build();
      await service.update(
        PROJECT,
        ITEM,
        { owner_ids: ['a', 'a', 'b', 'c', 'd', 'e'] },
        USER,
      );

      expect(mocks.replaceOwners).toHaveBeenCalledWith(ITEM, [
        'a',
        'b',
        'c',
        'd',
      ]);
    });

    it('clears the owner set when owner_ids is explicitly empty', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, ITEM, { owner_ids: [] }, USER);

      expect(mocks.replaceOwners).toHaveBeenCalledWith(ITEM, []);
    });

    it('replaces owners before the column update, so the joined row is fresh', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, ITEM, { owner_ids: ['a'] }, USER);

      expect(mocks.replaceOwners.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.update.mock.invocationCallOrder[0],
      );
    });
  });

  describe('remove', () => {
    it('clears task-scoped attachments before deleting the row, then audits', async () => {
      // Order is the point: deleting the row first would orphan the Storage
      // objects, which have no FK to cascade on.
      const { service, mocks } = build();
      await expect(service.remove(PROJECT, ITEM, USER)).resolves.toEqual({
        deleted: true,
      });

      expect(mocks.removeByParent).toHaveBeenCalledWith(
        PROJECT,
        { type: 'action_item', id: ITEM },
        USER,
      );
      expect(mocks.findOne.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.removeByParent.mock.invocationCallOrder[0],
      );
      expect(mocks.removeByParent.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.remove.mock.invocationCallOrder[0],
      );
      expect(mocks.remove.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.logDeleted.mock.invocationCallOrder[0],
      );
    });

    it('audits with the title read before the delete', async () => {
      const { service, mocks } = build({
        id: ITEM,
        title: 'Draft the rollback plan',
        owners: [],
      });
      await service.remove(PROJECT, ITEM, USER);

      expect(mocks.logDeleted).toHaveBeenCalledWith({
        table: 'action_items',
        recordId: ITEM,
        projectId: PROJECT,
        label: 'Draft the rollback plan',
        userId: USER,
      });
    });

    it('touches nothing when the item is not in this project', async () => {
      const { service, mocks } = build(null);

      await expect(service.remove(PROJECT, ITEM, USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mocks.removeByParent).not.toHaveBeenCalled();
      expect(mocks.remove).not.toHaveBeenCalled();
      expect(mocks.logDeleted).not.toHaveBeenCalled();
    });
  });

  describe('history and comments', () => {
    it('checks project ownership before reading history', async () => {
      const { service, mocks } = build(null);

      await expect(service.history(PROJECT, ITEM)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mocks.findHistory).not.toHaveBeenCalled();
    });

    it('checks project ownership before listing comments', async () => {
      const { service, mocks } = build(null);

      await expect(service.listComments(PROJECT, ITEM)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mocks.listComments).not.toHaveBeenCalled();
    });

    it('trims a comment body before storing it', async () => {
      const { service, mocks } = build();
      await service.addComment(PROJECT, ITEM, '  Looks good.  ', 'u-2');

      expect(mocks.insertComment).toHaveBeenCalledWith(
        ITEM,
        'Looks good.',
        'u-2',
      );
    });
  });
});
