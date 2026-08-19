import { RegistryService } from './registry.service';
import type { RegistryRepository } from './registry.repository';
import type { ProjectAccessService } from '../../common/access/project-access.service';

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 0). Repository extracted
 * first in the same commit, per the redefined phase.
 *
 * The rules here are FR-15 visibility and the people-directory grouping, and
 * neither was pinned. The grouping in particular has a quiet decision in it:
 * how an invited person with no account is identified across projects.
 */
describe('RegistryService', () => {
  const USER = 'u-1';
  const VISIBLE = 'p-visible';
  const HIDDEN = 'p-hidden';

  const member = (over: Record<string, unknown> = {}) => ({
    project_id: VISIBLE,
    user_id: null,
    pending_name: null,
    pending_email: null,
    access_level: 'read_only',
    status: 'active',
    role: null,
    profile: null,
    project: { name: 'Apollo' },
    ...over,
  });

  function build(over: { hidden?: string[] } = {}) {
    const mocks = {
      allMilestones: jest.fn().mockResolvedValue([
        { id: 'm-1', project_id: VISIBLE },
        { id: 'm-2', project_id: HIDDEN },
      ]),
      allActionItems: jest.fn().mockResolvedValue([
        { id: 'a-1', project_id: VISIBLE },
        { id: 'a-2', project_id: HIDDEN },
      ]),
      allMemberships: jest.fn().mockResolvedValue([]),
      hiddenProjectIds: jest
        .fn()
        .mockResolvedValue(new Set(over.hidden ?? [HIDDEN])),
    };
    const service = new RegistryService(
      mocks as unknown as RegistryRepository,
      {
        hiddenProjectIds: mocks.hiddenProjectIds,
      } as unknown as ProjectAccessService,
    );
    return { service, mocks };
  }

  describe('FR-15 visibility', () => {
    it('drops milestones on projects the caller cannot see', async () => {
      const { service } = build();
      const rows = await service.milestones(USER);

      expect(rows.map((m) => m.id)).toEqual(['m-1']);
    });

    it('drops action items the same way', async () => {
      const { service } = build();
      const rows = await service.actionItems(USER);

      expect(rows.map((a) => a.id)).toEqual(['a-1']);
    });

    it('returns everything when nothing is hidden', async () => {
      const { service } = build({ hidden: [] });

      await expect(service.milestones(USER)).resolves.toHaveLength(2);
    });

    it('hides a person whose only membership is on a hidden project', async () => {
      const { service, mocks } = build();
      mocks.allMemberships.mockResolvedValue([
        member({ project_id: HIDDEN, user_id: 'u-9' }),
      ]);

      await expect(service.people(USER)).resolves.toEqual([]);
    });

    it('keeps a person visible but omits their hidden memberships', async () => {
      const { service, mocks } = build();
      mocks.allMemberships.mockResolvedValue([
        member({ project_id: VISIBLE, user_id: 'u-9' }),
        member({ project_id: HIDDEN, user_id: 'u-9' }),
      ]);

      const people = await service.people(USER);
      expect(people).toHaveLength(1);
      expect(people[0].memberships.map((m) => m.project_id)).toEqual([VISIBLE]);
    });
  });

  describe('the people directory', () => {
    it('collapses one person’s many memberships into a single entry', async () => {
      const { service, mocks } = build({ hidden: [] });
      mocks.allMemberships.mockResolvedValue([
        member({ user_id: 'u-9', project_id: 'p-a' }),
        member({ user_id: 'u-9', project_id: 'p-b' }),
      ]);

      const people = await service.people(USER);
      expect(people).toHaveLength(1);
      expect(people[0].memberships).toHaveLength(2);
    });

    it('identifies an invited person by their pending name, case-insensitively', async () => {
      // The quiet decision: with no account there is no id, so the same
      // invitee spelled differently on two projects is still one person.
      const { service, mocks } = build({ hidden: [] });
      mocks.allMemberships.mockResolvedValue([
        member({ pending_name: 'Dana Whitfield', project_id: 'p-a' }),
        member({ pending_name: 'dana whitfield', project_id: 'p-b' }),
      ]);

      const people = await service.people(USER);
      expect(people).toHaveLength(1);
      expect(people[0].pending).toBe(true);
    });

    it('prefers the account name, then the account email, then the pending name', async () => {
      const { service, mocks } = build({ hidden: [] });
      mocks.allMemberships.mockResolvedValue([
        member({ user_id: 'u-1', profile: { full_name: 'Ada', email: 'a@x' } }),
        member({ user_id: 'u-2', profile: { full_name: null, email: 'b@x' } }),
        member({ user_id: 'u-3', pending_name: 'Cal' }),
        member({ user_id: 'u-4' }),
      ]);

      const names = (await service.people(USER)).map((p) => p.name);
      expect(names).toEqual(['Ada', 'b@x', 'Cal', 'Unknown']);
    });

    it('sorts by name, ignoring case', async () => {
      const { service, mocks } = build({ hidden: [] });
      mocks.allMemberships.mockResolvedValue([
        member({ user_id: 'u-1', profile: { full_name: 'zoe', email: null } }),
        member({ user_id: 'u-2', profile: { full_name: 'Adam', email: null } }),
      ]);

      const names = (await service.people(USER)).map((p) => p.name);
      expect(names).toEqual(['Adam', 'zoe']);
    });

    it('carries the role, access level and status onto each membership', async () => {
      const { service, mocks } = build({ hidden: [] });
      mocks.allMemberships.mockResolvedValue([
        member({
          user_id: 'u-9',
          role: { name: 'Sponsor' },
          access_level: 'read_write',
          status: 'pending',
        }),
      ]);

      expect((await service.people(USER))[0].memberships[0]).toEqual({
        project_id: VISIBLE,
        project_name: 'Apollo',
        role: 'Sponsor',
        access_level: 'read_write',
        status: 'pending',
      });
    });
  });
});
