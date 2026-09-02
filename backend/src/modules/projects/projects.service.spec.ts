import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import type {
  CreateProjectDto,
  ProjectMemberDto,
} from './dto/create-project.dto';

/**
 * Characterization tests (REFACTOR-PLAN phase 0b). These pin what the service
 * does TODAY, including the parts that may look arbitrary — the point is that a
 * refactor which changes any of it fails loudly rather than silently.
 *
 * Scope note: the repository is mocked. It is a thin wrapper around the
 * Supabase query builder, so a test of it would assert on a mocked fluent chain
 * rather than on behaviour. Repository query changes are NOT covered here.
 */
describe('ProjectsService', () => {
  const PROJECT = 'p-1';
  const USER = 'u-1';

  /** A detail row with just enough shape for the budget-threshold branch. */
  const detail = (over: Record<string, unknown> = {}) => ({
    id: PROJECT,
    name: 'Apollo',
    approved_budget: null,
    utilized_budget: null,
    owner_id: null,
    project_manager_id: null,
    ...over,
  });

  // Mocks are kept as locals and asserted on directly — asserting on
  // `repo.method` would be a method reference on the typed class, which trips
  // @typescript-eslint/unbound-method.
  function build() {
    const repo = {
      insert: jest.fn().mockResolvedValue({ id: PROJECT }),
      insertMembers: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findAll: jest.fn().mockResolvedValue([]),
      listStats: jest.fn().mockResolvedValue({}),
      findDetail: jest.fn().mockResolvedValue(detail()),
      findHistory: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue(undefined),
      deleteAttachmentObjects: jest.fn().mockResolvedValue(undefined),
    };
    const notifications = { notify: jest.fn().mockResolvedValue(undefined) };
    const access = { invalidateProject: jest.fn() };

    // Three collaborators; the tuple keeps the cast in one place.
    const deps = [repo, notifications, access] as unknown as ConstructorParameters<
      typeof ProjectsService
    >;

    return {
      service: new ProjectsService(...deps),
      repo,
      notifications,
      access,
    };
  }

  describe('create', () => {
    const member = (
      over: Partial<ProjectMemberDto> = {},
    ): ProjectMemberDto => ({
      user_id: 'u-9',
      role_id: 'r-1',
      ...over,
    });

    it('keeps members out of the project insert', async () => {
      const { service, repo } = build();
      const dto: CreateProjectDto = { name: 'Apollo', members: [member()] };
      await service.create(dto, USER);

      expect(repo.insert).toHaveBeenCalledWith({
        name: 'Apollo',
        created_by: USER,
        updated_by: USER,
      });
    });

    it('drops role-less members and marks account-less ones pending', async () => {
      const { service, repo } = build();
      const dto: CreateProjectDto = {
        name: 'Apollo',
        members: [
          member({ user_id: 'u-9', role_id: 'r-1' }),
          member({
            user_id: undefined,
            pending_name: 'Dana Whitfield',
            role_id: 'r-2',
          }),
          { user_id: 'u-8' } as ProjectMemberDto, // no role_id
        ],
      };
      await service.create(dto, USER);

      expect(repo.insertMembers).toHaveBeenCalledWith([
        {
          project_id: PROJECT,
          user_id: 'u-9',
          // A real account never carries a pending name, even if one was sent.
          pending_name: null,
          role_id: 'r-1',
          access_type: 'assigned',
          status: 'active',
          created_by: USER,
          updated_by: USER,
        },
        {
          project_id: PROJECT,
          user_id: null,
          pending_name: 'Dana Whitfield',
          role_id: 'r-2',
          access_type: 'assigned',
          status: 'pending',
          created_by: USER,
          updated_by: USER,
        },
      ]);
    });

    it('skips the member insert entirely when none survive the filter', async () => {
      const { service, repo } = build();
      const dto: CreateProjectDto = {
        name: 'Apollo',
        members: [{ user_id: 'u-8' } as ProjectMemberDto],
      };
      await service.create(dto, USER);

      expect(repo.insertMembers).not.toHaveBeenCalled();
    });

    it('deletes the project it just created when the member insert fails', async () => {
      // The compensating delete: without it a failed wizard leaves a stranded
      // project row behind.
      const { service, repo } = build();
      const boom = new Error('members failed');
      repo.insertMembers.mockRejectedValue(boom);

      await expect(
        service.create({ name: 'Apollo', members: [member()] }, USER),
      ).rejects.toBe(boom);
      expect(repo.delete).toHaveBeenCalledWith(PROJECT);
    });
  });

  describe('findAll', () => {
    const row = (over: Record<string, unknown> = {}) => ({
      id: PROJECT,
      start_date: null,
      target_end_date: null,
      ...over,
    });

    it('scopes the stats query to the page when paginating', async () => {
      const { service, repo } = build();
      repo.findAll.mockResolvedValue([row()]);
      await service.findAll({ limit: 10, offset: 0 });

      expect(repo.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(repo.listStats).toHaveBeenCalledWith([PROJECT]);
    });

    it('asks for all-project stats when unpaginated', async () => {
      const { service, repo } = build();
      await service.findAll();

      expect(repo.findAll).toHaveBeenCalledWith();
      expect(repo.listStats).toHaveBeenCalledWith(null);
    });

    it('substitutes a zero stat block for a project with no stats row', async () => {
      const { service, repo } = build();
      repo.findAll.mockResolvedValue([row()]);
      repo.listStats.mockResolvedValue({});

      await expect(service.findAll()).resolves.toEqual([
        {
          id: PROJECT,
          start_date: null,
          target_end_date: null,
          milestones_done: 0,
          milestones_total: 0,
          open_issues: 0,
          calculated_progress: null,
          planned_progress: null,
        },
      ]);
    });

    it('merges the stats row when there is one', async () => {
      const { service, repo } = build();
      repo.findAll.mockResolvedValue([row()]);
      repo.listStats.mockResolvedValue({
        [PROJECT]: {
          milestones_done: 3,
          milestones_total: 4,
          open_issues: 2,
          calculated_progress: 75,
        },
      });

      const [merged] = await service.findAll();
      expect(merged.calculated_progress).toBe(75);
      expect(merged.milestones_done).toBe(3);
    });

    it('computes planned progress from the project dates (F2)', async () => {
      // A window entirely in the past reads as 100% elapsed whenever this runs,
      // so the assertion does not depend on the clock.
      const { service, repo } = build();
      repo.findAll.mockResolvedValue([
        row({ start_date: '2020-01-01', target_end_date: '2020-12-31' }),
      ]);

      const [merged] = await service.findAll();
      expect(merged.planned_progress).toBe(100);
    });
  });

  describe('getDetail', () => {
    it('404s when the project does not exist', async () => {
      const { service, repo } = build();
      repo.findDetail.mockResolvedValue(null);

      await expect(service.getDetail(PROJECT)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('patches only the fields that were sent, always stamping updated_by', async () => {
      const { service, repo } = build();
      await service.update(PROJECT, { name: '  Apollo  ' }, USER);

      expect(repo.update).toHaveBeenCalledWith(PROJECT, {
        updated_by: USER,
        name: 'Apollo',
      });
    });

    it('coerces at_risk null to false and an empty start_date to null', async () => {
      // Dates use `|| null` (so '' clears them) while at_risk uses `?? false`.
      const { service, repo } = build();
      await service.update(PROJECT, { at_risk: null, start_date: '' }, USER);

      expect(repo.update).toHaveBeenCalledWith(PROJECT, {
        updated_by: USER,
        at_risk: false,
        start_date: null,
      });
    });

    /**
     * One test per normalization rule the patch builder implements. `?? null`
     * and `|| null` are NOT interchangeable here: a legitimate zero must
     * survive on the numeric fields, while a blank string must clear the
     * text and date ones.
     */
    describe('field normalization', () => {
      it('trims text fields and collapses blank ones to null', async () => {
        const { service, repo } = build();
        await service.update(
          PROJECT,
          { description: '  Migrate Apollo.  ', goal: '   ', sponsor: '' },
          USER,
        );

        expect(repo.update).toHaveBeenCalledWith(PROJECT, {
          updated_by: USER,
          description: 'Migrate Apollo.',
          goal: null,
          sponsor: null,
        });
      });

      it('keeps a numeric zero instead of nulling it', async () => {
        const { service, repo } = build();
        await service.update(PROJECT, { manual_progress: 0 }, USER);

        expect(repo.update).toHaveBeenCalledWith(PROJECT, {
          updated_by: USER,
          manual_progress: 0,
        });
      });

      it('keeps a zero budget instead of nulling it', async () => {
        const { service, repo } = build();
        await service.update(
          PROJECT,
          { approved_budget: 0, utilized_budget: 0 },
          USER,
        );

        expect(repo.update).toHaveBeenCalledWith(PROJECT, {
          updated_by: USER,
          approved_budget: 0,
          utilized_budget: 0,
        });
      });

      it('passes enums and booleans through untouched', async () => {
        const { service, repo } = build();
        await service.update(
          PROJECT,
          { access_control: 'restricted', is_priority: false },
          USER,
        );

        expect(repo.update).toHaveBeenCalledWith(PROJECT, {
          updated_by: USER,
          access_control: 'restricted',
          is_priority: false,
        });
      });

      it('clears an empty target_end_date to null', async () => {
        const { service, repo } = build();
        await service.update(PROJECT, { target_end_date: '' }, USER);

        expect(repo.update).toHaveBeenCalledWith(PROJECT, {
          updated_by: USER,
          target_end_date: null,
        });
      });

      it('collapses empty arrays to null and keeps populated ones', async () => {
        const { service, repo } = build();
        await service.update(
          PROJECT,
          { external_stakeholders: [], tags: ['migration'] },
          USER,
        );

        expect(repo.update).toHaveBeenCalledWith(PROJECT, {
          updated_by: USER,
          external_stakeholders: null,
          tags: ['migration'],
        });
      });

      it('writes an explicitly nulled lookup id as null', async () => {
        const { service, repo } = build();
        await service.update(PROJECT, { status_id: null }, USER);

        expect(repo.update).toHaveBeenCalledWith(PROJECT, {
          updated_by: USER,
          status_id: null,
        });
      });
    });

    it('re-reads the project after the write and returns that row', async () => {
      const { service, repo } = build();
      repo.findDetail.mockResolvedValue(detail({ name: 'Apollo II' }));

      await expect(
        service.update(PROJECT, { name: 'Apollo II' }, USER),
      ).resolves.toEqual(expect.objectContaining({ name: 'Apollo II' }));
      expect(repo.update.mock.invocationCallOrder[0]).toBeLessThan(
        repo.findDetail.mock.invocationCallOrder[0],
      );
    });

    it('does not read the prior row unless a budget field is changing', async () => {
      const { service, repo, notifications } = build();
      await service.update(PROJECT, { name: 'Apollo' }, USER);

      // Only the post-update read; no "before" snapshot was taken.
      expect(repo.findDetail).toHaveBeenCalledTimes(1);
      expect(notifications.notify).not.toHaveBeenCalled();
    });

    it('notifies owner and manager when utilization crosses 80%', async () => {
      const { service, repo, notifications } = build();
      repo.findDetail
        .mockResolvedValueOnce(
          detail({
            approved_budget: 100,
            utilized_budget: 10,
            owner_id: 'u-own',
            project_manager_id: 'u-pm',
          }),
        )
        .mockResolvedValueOnce(
          detail({
            approved_budget: 100,
            utilized_budget: 85,
            owner_id: 'u-own',
            project_manager_id: 'u-pm',
          }),
        );

      await service.update(PROJECT, { utilized_budget: 85 }, USER);

      expect(notifications.notify).toHaveBeenCalledTimes(2);
      expect(notifications.notify).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u-own',
          actorId: USER,
          projectId: PROJECT,
          type: 'budget_threshold',
          title: 'Apollo reached 85% budget utilization',
        }),
      );
    });

    it('notifies once when the owner is also the project manager', async () => {
      const { service, repo, notifications } = build();
      const budget = (utilized: number) =>
        detail({
          approved_budget: 100,
          utilized_budget: utilized,
          owner_id: 'u-own',
          project_manager_id: 'u-own',
        });
      repo.findDetail
        .mockResolvedValueOnce(budget(10))
        .mockResolvedValueOnce(budget(90));

      await service.update(PROJECT, { utilized_budget: 90 }, USER);

      expect(notifications.notify).toHaveBeenCalledTimes(1);
    });

    it('stays silent when the threshold was already crossed before the edit', async () => {
      const { service, repo, notifications } = build();
      const budget = (utilized: number) =>
        detail({
          approved_budget: 100,
          utilized_budget: utilized,
          owner_id: 'u-own',
        });
      repo.findDetail
        .mockResolvedValueOnce(budget(90))
        .mockResolvedValueOnce(budget(95));

      await service.update(PROJECT, { utilized_budget: 95 }, USER);

      expect(notifications.notify).not.toHaveBeenCalled();
    });

    it('stays silent below the threshold', async () => {
      const { service, repo, notifications } = build();
      const budget = (utilized: number) =>
        detail({
          approved_budget: 100,
          utilized_budget: utilized,
          owner_id: 'u-own',
        });
      repo.findDetail
        .mockResolvedValueOnce(budget(10))
        .mockResolvedValueOnce(budget(50));

      await service.update(PROJECT, { utilized_budget: 50 }, USER);

      expect(notifications.notify).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the project even when Storage cleanup fails', async () => {
      const { service, repo } = build();
      repo.deleteAttachmentObjects.mockRejectedValue(new Error('storage down'));

      await expect(service.remove(PROJECT)).resolves.toEqual({ deleted: true });
      expect(repo.delete).toHaveBeenCalledWith(PROJECT);
    });

    it('clears Storage objects before the rows cascade away', async () => {
      const { service, repo } = build();
      await service.remove(PROJECT);

      expect(
        repo.deleteAttachmentObjects.mock.invocationCallOrder[0],
      ).toBeLessThan(repo.delete.mock.invocationCallOrder[0]);
    });
  });
});
