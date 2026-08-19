import { NotFoundException } from '@nestjs/common';
import { SearchService } from './search.service';
import type { SearchRepository } from './search.repository';
import type { ProjectAccessService } from '../../common/access/project-access.service';

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 0). Repository extracted
 * first in the same commit.
 *
 * The rules worth pinning are the query sanitisation — which exists so a user
 * cannot break PostgREST's filter syntax or accidentally use wildcards — and
 * FR-15 filtering, which has a special case for project hits.
 */
describe('SearchService', () => {
  const USER = 'u-1';
  const HIDDEN = 'p-hidden';

  function build(over: { hidden?: string[] } = {}) {
    const mocks = {
      searchProjects: jest.fn().mockResolvedValue([]),
      searchChildren: jest.fn().mockResolvedValue([]),
      searchKpis: jest.fn().mockResolvedValue([]),
      listSaved: jest.fn().mockResolvedValue([{ id: 's-1' }]),
      insertSaved: jest.fn().mockResolvedValue({ id: 's-1' }),
      deleteSaved: jest.fn().mockResolvedValue({ id: 's-1' }),
      hiddenProjectIds: jest.fn().mockResolvedValue(new Set(over.hidden ?? [])),
    };
    const service = new SearchService(
      mocks as unknown as SearchRepository,
      {
        hiddenProjectIds: mocks.hiddenProjectIds,
      } as unknown as ProjectAccessService,
    );
    return { service, mocks };
  }

  describe('the query itself', () => {
    it('returns nothing for a query under two characters, without querying', async () => {
      const { service, mocks } = build();

      await expect(service.search('a', USER)).resolves.toEqual({
        query: 'a',
        hits: [],
      });
      expect(mocks.searchProjects).not.toHaveBeenCalled();
    });

    it('counts length after cleaning, not before', async () => {
      // '(a)' is three characters but one once the syntax breakers are gone.
      const { service, mocks } = build();

      await expect(service.search('(a)', USER)).resolves.toEqual({
        query: 'a',
        hits: [],
      });
      expect(mocks.searchProjects).not.toHaveBeenCalled();
    });

    it('strips the characters that would break the or-filter', async () => {
      const { service, mocks } = build();
      await service.search('  apollo, (data)  "x"  ', USER);

      expect(mocks.searchProjects).toHaveBeenCalledWith(
        '%apollo data x%',
        expect.any(Number) as number,
      );
    });

    it('escapes ilike wildcards so they match literally', async () => {
      // Someone searching for "50%" wants that string, not everything.
      const { service, mocks } = build();
      await service.search('50% off_peak', USER);

      expect(mocks.searchProjects).toHaveBeenCalledWith(
        '%50\\% off\\_peak%',
        expect.any(Number) as number,
      );
    });

    it('reports the cleaned query back to the caller', async () => {
      const { service } = build();
      const result = await service.search('  apollo   data  ', USER);

      expect(result.query).toBe('apollo data');
    });
  });

  describe('hits', () => {
    it('searches every kind and shapes each into a hit', async () => {
      const { service, mocks } = build();
      mocks.searchProjects.mockResolvedValue([{ id: 'p-1', name: 'Apollo' }]);
      mocks.searchKpis.mockResolvedValue([{ id: 'k-1', name: 'Uptime' }]);
      mocks.searchChildren.mockResolvedValue([
        {
          id: 'c-1',
          label: 'Cutover',
          project_id: 'p-1',
          project: { name: 'Apollo' },
        },
      ]);

      const { hits } = await service.search('apollo', USER);

      // one project, four child kinds, one kpi
      expect(mocks.searchChildren).toHaveBeenCalledTimes(4);
      expect(hits).toHaveLength(6);
      expect(hits[0]).toEqual({
        kind: 'project',
        id: 'p-1',
        label: 'Apollo',
        project_id: null,
        project_name: null,
      });
      expect(hits[1]).toEqual({
        kind: 'milestone',
        id: 'c-1',
        label: 'Cutover',
        project_id: 'p-1',
        project_name: 'Apollo',
      });
      expect(hits[hits.length - 1].kind).toBe('kpi');
    });

    it('caps each kind at eight', async () => {
      const { service, mocks } = build();
      await service.search('apollo', USER);

      expect(mocks.searchProjects).toHaveBeenCalledWith(expect.any(String), 8);
      expect(mocks.searchChildren).toHaveBeenCalledWith(
        'milestones',
        'name',
        expect.any(String) as string,
        8,
      );
    });
  });

  describe('FR-15 visibility', () => {
    it('drops child hits belonging to a hidden project', async () => {
      const { service, mocks } = build({ hidden: [HIDDEN] });
      mocks.searchChildren.mockResolvedValue([
        { id: 'c-1', label: 'Visible', project_id: 'p-ok', project: null },
        { id: 'c-2', label: 'Hidden', project_id: HIDDEN, project: null },
      ]);

      const { hits } = await service.search('apollo', USER);
      expect(hits.every((h) => h.label !== 'Hidden')).toBe(true);
    });

    it('drops the hidden project row itself, which carries no project_id', async () => {
      // The special case: a project hit is identified by its own id.
      const { service, mocks } = build({ hidden: [HIDDEN] });
      mocks.searchProjects.mockResolvedValue([
        { id: HIDDEN, name: 'Restricted' },
        { id: 'p-ok', name: 'Open' },
      ]);

      const { hits } = await service.search('apollo', USER);
      expect(hits.map((h) => h.id)).toEqual(['p-ok']);
    });

    it('leaves everything alone when nothing is hidden', async () => {
      const { service, mocks } = build({ hidden: [] });
      mocks.searchProjects.mockResolvedValue([{ id: 'p-1', name: 'Apollo' }]);

      const { hits } = await service.search('apollo', USER);
      expect(hits).toHaveLength(1);
    });
  });

  describe('saved searches', () => {
    it('scopes the list to the caller', async () => {
      const { service, mocks } = build();
      await service.listSaved(USER);

      expect(mocks.listSaved).toHaveBeenCalledWith(USER);
    });

    it('trims the name and the query it stores', async () => {
      const { service, mocks } = build();
      await service.addSaved(USER, { name: '  Mine  ', query: '  apollo  ' });

      expect(mocks.insertSaved).toHaveBeenCalledWith(USER, 'Mine', 'apollo');
    });

    it('404s when deleting a saved search that is not the caller’s', async () => {
      const { service, mocks } = build();
      mocks.deleteSaved.mockResolvedValue(null);

      await expect(service.removeSaved(USER, 's-9')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
