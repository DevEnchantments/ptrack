import { ActionItemsService } from './action-items.service';
import type { ActionItemsRepository } from './action-items.repository';
import type { RecordHistoryService } from '../../database/record-history.service';

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
    return { service: new ActionItemsService(repo, auditLog), mocks };
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
