import { NotFoundException } from '@nestjs/common';
import { StatusReportsService } from './status-reports.service';
import type { StatusReportsRepository } from './status-reports.repository';
import type { RecordHistoryService } from '../../database/record-history.service';
import type { CreateStatusReportDto } from './dto/create-status-report.dto';
import { describeProjectScopedContract } from '../../common/testing/project-scoped-contract';

/**
 * Characterization tests (REFACTOR-PLAN 2c). These pin what the service does
 * TODAY, including the parts that may look arbitrary.
 *
 * Scope note: the repository is mocked. It is a thin wrapper around the
 * Supabase query builder, so a test of it would assert on a mocked fluent chain
 * rather than on behaviour. Repository query changes are NOT covered here.
 */
describe('StatusReportsService', () => {
  const PROJECT = 'p-1';
  const REPORT = 'r-1';
  const USER = 'u-1';

  // Mocks are kept as locals and asserted on directly — asserting on
  // `repo.method` would be a method reference on the typed class, which trips
  // @typescript-eslint/unbound-method.
  function build() {
    const mocks = {
      findByProject: jest.fn().mockResolvedValue([{ id: REPORT }]),
      findOne: jest.fn().mockResolvedValue({ id: REPORT, title: 'Week 32' }),
      insert: jest.fn().mockResolvedValue({ id: REPORT }),
      update: jest.fn().mockResolvedValue({ id: REPORT }),
      remove: jest.fn().mockResolvedValue({ id: REPORT, label: 'Week 32' }),
      logDeleted: jest.fn().mockResolvedValue(undefined),
    };
    const service = new StatusReportsService(
      mocks as unknown as StatusReportsRepository,
      { logDeleted: mocks.logDeleted } as unknown as RecordHistoryService,
    );
    return { service, mocks };
  }

  const newReport: CreateStatusReportDto = {
    title: '  Week 32  ',
    summary: '  Cutover rehearsal completed.  ',
    report_date: '2026-08-10',
    viewable_by: 'all',
    editable_by: 'submitter',
  };

  describe('add', () => {
    it('trims the text and records the author separately from the audit columns', async () => {
      // author_id is a domain field (who wrote the report), not an audit one —
      // it happens to be the same user here, but they are different concepts.
      const { service, mocks } = build();
      await service.add(PROJECT, newReport, USER);

      expect(mocks.insert).toHaveBeenCalledWith({
        project_id: PROJECT,
        title: 'Week 32',
        summary: 'Cutover rehearsal completed.',
        report_date: '2026-08-10',
        viewable_by: 'all',
        editable_by: 'submitter',
        author_id: USER,
        created_by: USER,
        updated_by: USER,
      });
    });

    it('returns the joined row the repository gives back', async () => {
      const { service } = build();
      await expect(service.add(PROJECT, newReport, USER)).resolves.toEqual({
        id: REPORT,
      });
    });
  });

  describe('get', () => {
    it('404s when the report is not in this project', async () => {
      const { service, mocks } = build();
      mocks.findOne.mockResolvedValue(null);

      await expect(service.get(PROJECT, REPORT)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('patches only the fields that were sent, always stamping updated_by', async () => {
      const { service, mocks } = build();
      await service.update(PROJECT, REPORT, {}, USER);

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, REPORT, {
        updated_by: USER,
      });
    });

    it('trims title and summary, and passes the rest through untouched', async () => {
      const { service, mocks } = build();
      await service.update(
        PROJECT,
        REPORT,
        {
          title: '  Week 33  ',
          summary: '  Cutover complete.  ',
          viewable_by: 'submitter_and_members',
        },
        USER,
      );

      expect(mocks.update).toHaveBeenCalledWith(PROJECT, REPORT, {
        updated_by: USER,
        title: 'Week 33',
        summary: 'Cutover complete.',
        viewable_by: 'submitter_and_members',
      });
    });

    it('does not spend a read pre-checking ownership', async () => {
      // Unlike milestones/, which calls get() first. The repository's own
      // filter is what scopes the write to this project.
      const { service, mocks } = build();
      await service.update(PROJECT, REPORT, { title: 'x' }, USER);

      expect(mocks.findOne).not.toHaveBeenCalled();
    });

    it('404s when the report is not in this project', async () => {
      const { service, mocks } = build();
      mocks.update.mockResolvedValue(null);

      await expect(
        service.update(PROJECT, REPORT, { title: 'x' }, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('404s and writes no audit row when the report is not in this project', async () => {
      const { service, mocks } = build();
      mocks.remove.mockResolvedValue(null);

      await expect(
        service.remove(PROJECT, REPORT, USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mocks.logDeleted).not.toHaveBeenCalled();
    });

    it('audits the delete with the title the repository resolved', async () => {
      const { service, mocks } = build();

      await expect(service.remove(PROJECT, REPORT, USER)).resolves.toEqual({
        deleted: true,
      });
      expect(mocks.logDeleted).toHaveBeenCalledWith({
        table: 'status_reports',
        recordId: REPORT,
        projectId: PROJECT,
        label: 'Week 32',
        userId: USER,
      });
    });
  });

  describe('list', () => {
    it('hands the project id straight to the repository', async () => {
      const { service, mocks } = build();
      await expect(service.list(PROJECT)).resolves.toEqual([{ id: REPORT }]);
      expect(mocks.findByProject).toHaveBeenCalledWith(PROJECT);
    });
  });

  // The contract every project-scoped module shares (REFACTOR-PLAN v2, B4).
  describeProjectScopedContract('status-reports', {
    build: () => build(),
    update: (s) => s.update(PROJECT, REPORT, {}, USER),
    remove: (s) => s.remove(PROJECT, REPORT, USER),
    foreignId: (m) => {
      m.update.mockResolvedValue(null);
      m.remove.mockResolvedValue(null);
    },
    audit: (m) => m.logDeleted,
  });
});
