import { planClaim } from './users.logic';

describe('planClaim', () => {
  it('converts pending rows where the user is not yet a member', () => {
    expect(
      planClaim(
        [
          { id: 'a', project_id: 'p1' },
          { id: 'b', project_id: 'p2' },
        ],
        new Set(),
      ),
    ).toEqual({ toUpdate: ['a', 'b'], toDelete: [] });
  });

  it('deletes pending rows that would collide with an existing membership', () => {
    expect(
      planClaim(
        [
          { id: 'a', project_id: 'p1' },
          { id: 'b', project_id: 'p2' },
        ],
        new Set(['p2']),
      ),
    ).toEqual({ toUpdate: ['a'], toDelete: ['b'] });
  });

  it('handles no pending rows', () => {
    expect(planClaim([], new Set(['p1']))).toEqual({
      toUpdate: [],
      toDelete: [],
    });
  });
});
