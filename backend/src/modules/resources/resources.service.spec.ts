import { NotFoundException } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import type { ResourcesRepository } from './resources.repository';
import type { RecordHistoryService } from '../../database/record-history.service';
import { describeProjectScopedContract } from '../../common/testing/project-scoped-contract';

/** Characterization tests over the simplest register: trim, null, audit. */
describe('ResourcesService', () => {
  const PROJECT = 'p-1';
  const RESOURCE = 'res-1';
  const USER = 'u-1';

  function build(
    over: {
      updated?: Record<string, unknown> | null;
      removed?: Record<string, unknown> | null;
    } = {},
  ) {
    const mocks = {
      insert: jest.fn().mockResolvedValue({ id: RESOURCE }),
      update: jest
        .fn()
        .mockResolvedValue('updated' in over ? over.updated : { id: RESOURCE }),
      remove: jest
        .fn()
        .mockResolvedValue(
          'removed' in over
            ? over.removed
            : { id: RESOURCE, label: 'Consultant' },
        ),
      logDeleted: jest.fn().mockResolvedValue(undefined),
    };
    const service = new ResourcesService(
      mocks as unknown as ResourcesRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
    );
    return { service, mocks };
  }

  it('add trims the name and collapses a blank description to null', async () => {
    const { service, mocks } = build();
    await service.add(
      PROJECT,
      { name: '  Marine consultant ', type_id: 't-1', description: '  ' },
      USER,
    );
    expect(mocks.insert).toHaveBeenCalledWith({
      project_id: PROJECT,
      name: 'Marine consultant',
      type_id: 't-1',
      description: null,
      created_by: USER,
      updated_by: USER,
    });
  });

  it('update patches only sent fields and 404s on foreign ids', async () => {
    const ok = build();
    await ok.service.update(PROJECT, RESOURCE, { name: ' New ' }, USER);
    expect(ok.mocks.update).toHaveBeenCalledWith(PROJECT, RESOURCE, {
      updated_by: USER,
      name: 'New',
    });

    const missing = build({ updated: null });
    await expect(
      missing.service.update(PROJECT, RESOURCE, { name: 'x' }, USER),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('remove audits with the deleted label; foreign ids 404 without audit', async () => {
    const ok = build();
    await expect(ok.service.remove(PROJECT, RESOURCE, USER)).resolves.toEqual({
      deleted: true,
    });
    expect(ok.mocks.logDeleted).toHaveBeenCalledWith(
      expect.objectContaining({ table: 'resources', label: 'Consultant' }),
    );

    const missing = build({ removed: null });
    await expect(
      missing.service.remove(PROJECT, RESOURCE, USER),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(missing.mocks.logDeleted).not.toHaveBeenCalled();
  });

  // The contract every project-scoped module shares (REFACTOR-PLAN v2, B4).
  describeProjectScopedContract('resources', {
    build: () => build(),
    update: (s) => s.update(PROJECT, RESOURCE, {}, USER),
    remove: (s) => s.remove(PROJECT, RESOURCE, USER),
    foreignId: (m) => {
      m.update.mockResolvedValue(null);
      m.remove.mockResolvedValue(null);
    },
    audit: (m) => m.logDeleted,
  });
});
