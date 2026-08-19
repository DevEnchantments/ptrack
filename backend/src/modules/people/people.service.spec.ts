import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PeopleService } from './people.service';
import type { PeopleRepository } from './people.repository';
import { describeProjectScopedContract } from '../../common/testing/project-scoped-contract';

/**
 * Characterization tests. Membership rows carry the provisioning pipeline:
 * pending people MUST have an email (it is how their account gets linked on
 * claim), and a real user_id nulls the pending fields entirely.
 */
describe('PeopleService', () => {
  const PROJECT = 'p-1';
  const MEMBER = 'm-1';
  const USER = 'u-1';

  function build(over: { updated?: Record<string, unknown> | null } = {}) {
    const mocks = {
      insert: jest.fn().mockResolvedValue({ id: MEMBER }),
      update: jest
        .fn()
        .mockResolvedValue('updated' in over ? over.updated : { id: MEMBER }),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const service = new PeopleService(mocks as unknown as PeopleRepository);
    return { service, mocks };
  }

  describe('add', () => {
    it('rejects a member with neither a user nor a name', async () => {
      const { service } = build();
      await expect(
        service.add(
          PROJECT,
          { role_id: 'r-1', access_level: 'read_only' },
          USER,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects a pending person without an email — claim needs it', async () => {
      const { service } = build();
      await expect(
        service.add(
          PROJECT,
          { pending_name: 'Mariam', role_id: 'r-1', access_level: 'read_only' },
          USER,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('lowercases and trims the pending email; status starts pending', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        {
          pending_name: '  Mariam Al Shamsi ',
          pending_email: ' Mariam.AlShamsi@POC.ptrack.local ',
          role_id: 'r-1',
          access_level: 'read_write',
        },
        USER,
      );
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          pending_name: 'Mariam Al Shamsi',
          pending_email: 'mariam.alshamsi@poc.ptrack.local',
          status: 'pending',
          access_type: 'assigned',
        }),
      );
    });

    it('a real user nulls the pending fields and starts active', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        {
          user_id: 'real-user',
          pending_name: 'ignored',
          pending_email: 'ignored@x.y',
          role_id: 'r-1',
          access_level: 'read_only',
        },
        USER,
      );
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'real-user',
          pending_name: null,
          pending_email: null,
          status: 'active',
        }),
      );
    });
  });

  describe('update', () => {
    it('patches only sent fields, lowercasing a changed pending email', async () => {
      const { service, mocks } = build();
      await service.update(
        PROJECT,
        MEMBER,
        { pending_email: ' NEW@POC.ptrack.local ' },
        USER,
      );
      expect(mocks.update).toHaveBeenCalledWith(PROJECT, MEMBER, {
        updated_by: USER,
        pending_email: 'new@poc.ptrack.local',
      });
    });

    it('404s when the member is not in this project', async () => {
      const { service } = build({ updated: null });
      await expect(
        service.update(PROJECT, MEMBER, { notes: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('reports deleted when a row was removed, 404s on foreign ids', async () => {
      const { service, mocks } = build();
      mocks.remove.mockResolvedValueOnce({ id: MEMBER });
      await expect(service.remove(PROJECT, MEMBER)).resolves.toEqual({
        deleted: true,
      });

      mocks.remove.mockResolvedValueOnce(null);
      await expect(service.remove(PROJECT, 'not-there')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  // The contract every project-scoped module shares (REFACTOR-PLAN v2, B4).
  describeProjectScopedContract('people', {
    build: () => build(),
    update: (s) => s.update(PROJECT, MEMBER, {}, USER),
    remove: (s) => s.remove(PROJECT, MEMBER),
    foreignId: (m) => {
      m.update.mockResolvedValue(null);
      m.remove.mockResolvedValue(null);
    },
    audit: {
      skip: 'people.remove writes no audit row - who removed a member leaves no trace (finding 2026-08-19)',
    },
  });
});
