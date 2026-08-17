import { NotFoundException } from '@nestjs/common';
import { LinksService } from './links.service';
import type { LinksRepository } from './links.repository';
import type { RecordHistoryService } from '../../database/record-history.service';

/**
 * Characterization tests (REFACTOR-PLAN phase 0b). These pin what the service
 * does TODAY, including the parts that may look arbitrary — the point is that a
 * refactor which changes any of it fails loudly rather than silently.
 *
 * Scope note: the repository is mocked. It is a thin wrapper around the
 * Supabase query builder, so a test of it would assert on a mocked fluent chain
 * rather than on behaviour. Repository query changes are NOT covered here.
 */
describe('LinksService', () => {
  const PROJECT = 'p-1';
  const LINK = 'l-1';
  const USER = 'u-1';

  // Mocks are kept as locals and asserted on directly — asserting on
  // `repo.method` would be a method reference on the typed class, which trips
  // @typescript-eslint/unbound-method.
  function build(
    removed: { id: string; label: string | null } | null = {
      id: LINK,
      label: 'Cutover runbook',
    },
  ) {
    const mocks = {
      findByProject: jest.fn().mockResolvedValue([{ id: LINK }]),
      insert: jest.fn().mockResolvedValue({ id: LINK }),
      update: jest.fn().mockResolvedValue({ id: LINK }),
      remove: jest.fn().mockResolvedValue(removed),
      logDeleted: jest.fn().mockResolvedValue(undefined),
    };
    const repo = mocks as unknown as LinksRepository;
    const auditLog = {
      logDeleted: mocks.logDeleted,
    } as unknown as RecordHistoryService;
    return { service: new LinksService(repo, auditLog), mocks };
  }

  describe('list', () => {
    it('hands the project id straight to the repository', async () => {
      const { service, mocks } = build();
      await expect(service.list(PROJECT)).resolves.toEqual([{ id: LINK }]);
      expect(mocks.findByProject).toHaveBeenCalledWith(PROJECT);
    });
  });

  describe('add', () => {
    it('trims the url and collapses blank text and empty tags to null', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        {
          url: '  https://intranet.example.com/runbook  ',
          label: '   ',
          description: '',
          tags: [],
        },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith({
        project_id: PROJECT,
        url: 'https://intranet.example.com/runbook',
        label: null,
        description: null,
        // Absent is_gold becomes an explicit false, not undefined.
        is_gold: false,
        tags: null,
        // The creator is written to BOTH columns on insert.
        created_by: USER,
        updated_by: USER,
      });
    });

    it('keeps the values it is given', async () => {
      const { service, mocks } = build();
      await service.add(
        PROJECT,
        {
          url: 'https://x.example.com/a',
          label: '  Cutover runbook  ',
          description: '  Step by step.  ',
          is_gold: true,
          tags: ['runbook'],
        },
        USER,
      );

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'Cutover runbook',
          description: 'Step by step.',
          is_gold: true,
          tags: ['runbook'],
        }),
      );
    });

    it('returns the inserted row unchanged', async () => {
      const { service } = build();
      await expect(
        service.add(PROJECT, { url: 'https://x.example.com/a' }, USER),
      ).resolves.toEqual({ id: LINK });
    });
  });

  describe('update', () => {
    it('patches only the fields that were sent, always stamping updated_by', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, LINK, {}, USER);

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, LINK, {
        updated_by: USER,
      });
    });

    it('keeps is_gold: false instead of dropping it', async () => {
      // The guard is `!== undefined`, not truthiness, so un-starring a link
      // actually reaches the database.
      const { service, mocks } = build();
      await service.update(PROJECT, LINK, { is_gold: false }, USER);

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, LINK, {
        updated_by: USER,
        is_gold: false,
      });
    });

    it('404s when the link is not in this project', async () => {
      // Regression: the repository used `.single()`, so "no rows" arrived as
      // PostgREST PGRST116 and fell through toHttpException's default to a 500.
      const { service, mocks } = build();
      mocks.update.mockResolvedValue(null);

      await expect(
        service.update(PROJECT, LINK, { label: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('clears blank text and empty tag arrays to null', async () => {
      const { service, mocks } = build();
      await service.update(
        PROJECT,
        LINK,
        { url: '  https://x.example.com/b  ', label: '', tags: [] },
        USER,
      );

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, LINK, {
        updated_by: USER,
        url: 'https://x.example.com/b',
        label: null,
        tags: null,
      });
    });
  });

  describe('remove', () => {
    it('404s and writes no audit row when the link is not in this project', async () => {
      const { service, mocks } = build(null);

      await expect(service.remove(PROJECT, LINK, USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mocks.logDeleted).not.toHaveBeenCalled();
    });

    it('audits the delete with the label the repository resolved', async () => {
      const { service, mocks } = build({ id: LINK, label: 'Cutover runbook' });

      await expect(service.remove(PROJECT, LINK, USER)).resolves.toEqual({
        deleted: true,
      });
      expect(mocks.logDeleted).toHaveBeenCalledWith({
        table: 'links',
        recordId: LINK,
        projectId: PROJECT,
        label: 'Cutover runbook',
        userId: USER,
      });
    });
  });
});
