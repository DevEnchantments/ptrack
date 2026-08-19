import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccessAdminService } from './access-admin.service';
import type { AccessAdminRepository } from './access-admin.repository';
import type { AppRoleService } from '../../common/access/app-role.service';
import type { CapabilityService } from '../../common/access/capability.service';

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 0). These pin what the
 * service does TODAY.
 *
 * This module had no repository, so there was no seam to test against and the
 * only option was asserting on a mocked Supabase chain. The repository was
 * extracted first in the same commit — the ordering is deliberate and recorded
 * in the session log, because it inverts ground rule 2.
 *
 * The rules here are security rules: who may hold which role, and whether the
 * system can be left with nobody able to fix it.
 */
describe('AccessAdminService', () => {
  const ACTOR = 'u-admin';
  const TARGET = 'u-target';

  function build(
    over: {
      profile?: {
        id: string;
        email: string | null;
        app_role: string;
      } | null;
      adminCount?: number;
      auditFailure?: string | null;
    } = {},
  ) {
    const mocks = {
      listProfiles: jest.fn().mockResolvedValue([{ id: TARGET }]),
      findProfile: jest
        .fn()
        .mockResolvedValue(
          over.profile === undefined
            ? { id: TARGET, email: 'target@x.com', app_role: 'user' }
            : over.profile,
        ),
      countAdmins: jest.fn().mockResolvedValue(over.adminCount ?? 2),
      setAppRole: jest.fn().mockResolvedValue({ id: TARGET, app_role: 'pmo' }),
      replaceRoleCapabilities: jest.fn().mockResolvedValue(undefined),
      insertAudit: jest.fn().mockResolvedValue(over.auditFailure ?? null),
      clearUser: jest.fn(),
      clearCache: jest.fn(),
      grants: jest.fn().mockResolvedValue({
        pmo: new Set(['projects.create']),
        executive: new Set<string>(),
        user: new Set<string>(),
      }),
    };
    const service = new AccessAdminService(
      mocks as unknown as AccessAdminRepository,
      { clearUser: mocks.clearUser } as unknown as AppRoleService,
      {
        grants: mocks.grants,
        clearCache: mocks.clearCache,
      } as unknown as CapabilityService,
    );
    return { service, mocks };
  }

  describe('updateRole', () => {
    it('rejects a role outside the known set, listing them', async () => {
      const { service, mocks } = build();

      await expect(
        service.updateRole(TARGET, 'superuser', ACTOR),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(mocks.findProfile).not.toHaveBeenCalled();
    });

    it('404s when the user does not exist', async () => {
      const { service } = build({ profile: null });

      await expect(
        service.updateRole(TARGET, 'pmo', ACTOR),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('is a no-op when the role is already what was asked for', async () => {
      // No write, no cache clear, and crucially no audit row for a change
      // that did not happen.
      const { service, mocks } = build({
        profile: { id: TARGET, email: 'target@x.com', app_role: 'pmo' },
      });

      await expect(service.updateRole(TARGET, 'pmo', ACTOR)).resolves.toEqual({
        id: TARGET,
        app_role: 'pmo',
      });
      expect(mocks.setAppRole).not.toHaveBeenCalled();
      expect(mocks.insertAudit).not.toHaveBeenCalled();
    });

    it('refuses to demote the last remaining admin', async () => {
      // The system must always keep someone who can undo a mistake.
      const { service, mocks } = build({
        profile: { id: TARGET, email: 'target@x.com', app_role: 'admin' },
        adminCount: 1,
      });

      await expect(service.updateRole(TARGET, 'user', ACTOR)).rejects.toThrow(
        /Cannot demote the last remaining admin/,
      );
      expect(mocks.setAppRole).not.toHaveBeenCalled();
    });

    it('allows demoting an admin while another remains', async () => {
      const { service, mocks } = build({
        profile: { id: TARGET, email: 'target@x.com', app_role: 'admin' },
        adminCount: 2,
      });

      await service.updateRole(TARGET, 'user', ACTOR);
      expect(mocks.setAppRole).toHaveBeenCalledWith(TARGET, 'user');
    });

    it('does not count admins when promoting to admin', async () => {
      // The guard is only about losing the last one.
      const { service, mocks } = build();

      await service.updateRole(TARGET, 'admin', ACTOR);
      expect(mocks.countAdmins).not.toHaveBeenCalled();
    });

    it('clears the cached role and audits the change', async () => {
      const { service, mocks } = build();
      await service.updateRole(TARGET, 'pmo', ACTOR);

      expect(mocks.clearUser).toHaveBeenCalledWith(TARGET);
      expect(mocks.insertAudit).toHaveBeenCalledWith({
        actorId: ACTOR,
        action: 'role_changed',
        target: 'target@x.com',
        oldValue: 'user',
        newValue: 'pmo',
      });
    });

    it('audits against the user id when the profile has no email', async () => {
      const { service, mocks } = build({
        profile: { id: TARGET, email: null, app_role: 'user' },
      });
      await service.updateRole(TARGET, 'pmo', ACTOR);

      expect(mocks.insertAudit).toHaveBeenCalledWith(
        expect.objectContaining({ target: TARGET }),
      );
    });

    it('404s when the profile vanishes between the read and the write', async () => {
      const { service, mocks } = build();
      mocks.setAppRole.mockResolvedValue(null);

      await expect(
        service.updateRole(TARGET, 'pmo', ACTOR),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('still succeeds when the audit write fails', async () => {
      // Deliberate: a broken audit table must not block a role change.
      const { service } = build({ auditFailure: 'relation does not exist' });

      await expect(service.updateRole(TARGET, 'pmo', ACTOR)).resolves.toEqual({
        id: TARGET,
        app_role: 'pmo',
      });
    });
  });

  describe('replaceGrants', () => {
    it('refuses a role that is not editable, naming the ones that are', async () => {
      const { service, mocks } = build();

      await expect(service.replaceGrants('admin', [], ACTOR)).rejects.toThrow(
        /admin bypasses the grid/,
      );
      expect(mocks.replaceRoleCapabilities).not.toHaveBeenCalled();
    });

    it('refuses unknown capabilities, listing them', async () => {
      const { service, mocks } = build();

      await expect(
        service.replaceGrants('pmo', ['projects.create', 'not.a.thing'], ACTOR),
      ).rejects.toThrow(/Unknown capabilities: not.a.thing/);
      expect(mocks.replaceRoleCapabilities).not.toHaveBeenCalled();
    });

    it('de-duplicates the submitted set', async () => {
      const { service, mocks } = build();
      await service.replaceGrants(
        'pmo',
        ['projects.create', 'projects.create'],
        ACTOR,
      );

      expect(mocks.replaceRoleCapabilities).toHaveBeenCalledWith('pmo', [
        'projects.create',
      ]);
    });

    it('clears the capability cache and audits the before and after sets', async () => {
      const { service, mocks } = build();
      await service.replaceGrants('pmo', [], ACTOR);

      expect(mocks.clearCache).toHaveBeenCalled();
      expect(mocks.insertAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'grants_replaced',
          target: 'pmo',
          oldValue: 'projects.create',
          newValue: '',
        }),
      );
    });
  });

  describe('getGrants', () => {
    it('returns the catalog alongside each editable role, sorted', async () => {
      const { service } = build();
      const result = await service.getGrants();

      expect(result.grants.pmo).toEqual(['projects.create']);
      expect(result.catalog.length).toBeGreaterThan(0);
    });
  });

  describe('listUsers', () => {
    it('hands the profile list straight back', async () => {
      const { service } = build();
      await expect(service.listUsers()).resolves.toEqual([{ id: TARGET }]);
    });
  });
});
