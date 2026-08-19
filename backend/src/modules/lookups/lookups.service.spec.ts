import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LookupsService } from './lookups.service';
import type { LookupsRepository } from './lookups.repository';

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 0). These pin what the
 * service does TODAY.
 *
 * The repository was extracted first in the same commit, per the redefined
 * Phase 0: with the queries inline there was no seam and a test could only
 * assert on a mocked Supabase chain.
 *
 * Worth stating plainly: this module was filed as "read-only, mostly query
 * shaping, low value to test". That was wrong. It carries a table whitelist, a
 * cache with targeted invalidation, a per-table column whitelist, and an
 * access-level fallback — all rules, and all previously unpinned.
 */
describe('LookupsService', () => {
  function build() {
    const mocks = {
      listActive: jest.fn().mockResolvedValue([{ id: 'l-1', name: 'One' }]),
      listAll: jest.fn().mockResolvedValue([{ id: 'l-1', name: 'One' }]),
      insert: jest.fn().mockResolvedValue({ id: 'l-1', name: 'One' }),
      update: jest.fn().mockResolvedValue({ id: 'l-1', name: 'One' }),
    };
    const service = new LookupsService(mocks as unknown as LookupsRepository);
    return { service, mocks };
  }

  describe('list', () => {
    it('404s on a lookup that is not whitelisted', async () => {
      // The whitelist is the security boundary: the URL segment names a table.
      const { service, mocks } = build();

      await expect(service.list('profiles')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mocks.listActive).not.toHaveBeenCalled();
    });

    it('maps the url segment to its physical table', async () => {
      const { service, mocks } = build();
      await service.list('project-roles');

      expect(mocks.listActive).toHaveBeenCalledWith(
        'project_roles',
        'id, name',
      );
    });

    it('selects the extra column a cascading lookup needs', async () => {
      const { service, mocks } = build();
      await service.list('strategic-programs');

      expect(mocks.listActive).toHaveBeenCalledWith(
        'strategic_programs',
        'id, name, objective_id',
      );
    });

    it('serves a repeat read from cache without touching the database', async () => {
      const { service, mocks } = build();
      await service.list('tiers');
      await service.list('tiers');

      expect(mocks.listActive).toHaveBeenCalledTimes(1);
    });

    it('refetches once the 60s TTL has passed', async () => {
      jest.useFakeTimers();
      try {
        const { service, mocks } = build();
        await service.list('tiers');
        jest.advanceTimersByTime(60_001);
        await service.list('tiers');

        expect(mocks.listActive).toHaveBeenCalledTimes(2);
      } finally {
        jest.useRealTimers();
      }
    });

    it('caches per lookup, not globally', async () => {
      const { service, mocks } = build();
      await service.list('tiers');
      await service.list('sectors');

      expect(mocks.listActive).toHaveBeenCalledTimes(2);
    });
  });

  describe('the create shortcuts', () => {
    it('rejects a blank name', async () => {
      const { service } = build();

      await expect(service.createCategory('   ')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(service.createSector('')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(
        service.createRole('  ', 'read_only'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('trims the name it stores', async () => {
      const { service, mocks } = build();
      await service.createCategory('  Migration  ');

      expect(mocks.insert).toHaveBeenCalledWith(
        'project_categories',
        { name: 'Migration' },
        'id, name',
      );
    });

    it('falls back to read_only for an unknown access level', async () => {
      // Rather than rejecting it: a bad level from the UI becomes the safest
      // one, not an error.
      const { service, mocks } = build();
      await service.createRole('Reviewer', 'superuser');

      expect(mocks.insert).toHaveBeenCalledWith(
        'project_roles',
        { name: 'Reviewer', default_access_level: 'read_only' },
        'id, name',
      );
    });

    it('keeps a valid access level', async () => {
      const { service, mocks } = build();
      await service.createRole('Editor', 'read_write');

      expect(mocks.insert).toHaveBeenCalledWith(
        'project_roles',
        expect.objectContaining({ default_access_level: 'read_write' }),
        'id, name',
      );
    });

    it('invalidates only the cache entry it just changed', async () => {
      const { service, mocks } = build();
      await service.list('project-categories');
      await service.list('sectors');
      await service.createCategory('Migration');
      await service.list('project-categories');
      await service.list('sectors');

      // categories refetched, sectors still served from cache
      expect(mocks.listActive).toHaveBeenCalledTimes(3);
    });
  });

  describe('admin editing', () => {
    it('404s on a table that is not whitelisted', async () => {
      const { service } = build();

      await expect(
        service.addValue('profiles', { name: 'x' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects a blank value name', async () => {
      const { service } = build();

      await expect(
        service.addValue('tiers', { name: '   ' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('accepts an extra column on the table that owns it', async () => {
      const { service, mocks } = build();
      await service.addValue('project-statuses', {
        name: 'Blocked',
        color: '#f00',
      });

      expect(mocks.insert).toHaveBeenCalledWith(
        'project_statuses',
        { name: 'Blocked', color: '#f00' },
        'id, name, sort_order, is_active',
      );
    });

    it('refuses an extra column on a table that does not have it', async () => {
      // The per-table whitelist is enforced server-side: `color` is a
      // project_statuses column, not a tiers one.
      const { service, mocks } = build();

      await expect(
        service.addValue('tiers', { name: 'Gold', color: '#f00' }),
      ).rejects.toThrow(/"color" does not apply/);
      expect(mocks.insert).not.toHaveBeenCalled();
    });

    it('omits sort_order entirely when it was not supplied', async () => {
      const { service, mocks } = build();
      await service.addValue('tiers', { name: 'Gold' });

      expect(mocks.insert).toHaveBeenCalledWith(
        'tiers',
        { name: 'Gold' },
        expect.any(String) as string,
      );
    });

    it('refuses an update with nothing in it', async () => {
      const { service } = build();

      await expect(service.updateValue('tiers', 'l-1', {})).rejects.toThrow(
        /Nothing to update/,
      );
    });

    it('rejects clearing a name to blank', async () => {
      const { service } = build();

      await expect(
        service.updateValue('tiers', 'l-1', { name: '   ' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('deactivates without touching anything else', async () => {
      const { service, mocks } = build();
      await service.updateValue('tiers', 'l-1', { is_active: false });

      expect(mocks.update).toHaveBeenCalledWith(
        'tiers',
        'l-1',
        { is_active: false },
        'id, name, sort_order, is_active',
      );
    });

    it('404s when the value does not exist', async () => {
      const { service, mocks } = build();
      mocks.update.mockResolvedValue(null);

      await expect(
        service.updateValue('tiers', 'nope', { name: 'Gold' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('adminList', () => {
    it('returns every whitelisted table with the extras it allows', async () => {
      const { service, mocks } = build();
      const result = await service.adminList();

      expect(Object.keys(result)).toContain('project-statuses');
      expect(result['project-statuses'].extras).toEqual(['color']);
      expect(result['tiers'].extras).toEqual([]);
      // One read per code table, all issued concurrently.
      expect(mocks.listAll).toHaveBeenCalledTimes(Object.keys(result).length);
    });
  });
});
