import {
  AccessLevel,
  atLeastRole,
  defaultLevelFor,
  isAppRole,
  resolveProjectLevel,
  type ProjectAccessInput,
} from './access.logic';

const base: ProjectAccessInput = {
  appRole: 'user',
  userId: 'u-1',
  accessControl: 'open',
  ownerId: null,
  projectManagerId: null,
  projectManager2Id: null,
  pmoPartnerId: null,
  membershipLevel: null,
};

describe('atLeastRole', () => {
  it('orders admin > pmo > executive > user', () => {
    expect(atLeastRole('admin', 'pmo')).toBe(true);
    expect(atLeastRole('pmo', 'admin')).toBe(false);
    expect(atLeastRole('executive', 'pmo')).toBe(false);
    expect(atLeastRole('user', 'user')).toBe(true);
  });
});

describe('isAppRole', () => {
  it('accepts only the four known roles', () => {
    expect(isAppRole('pmo')).toBe(true);
    expect(isAppRole('superuser')).toBe(false);
    expect(isAppRole(null)).toBe(false);
  });
});

describe('resolveProjectLevel', () => {
  it('gives pmo and admin manage everywhere, restricted included', () => {
    expect(
      resolveProjectLevel({
        ...base,
        appRole: 'pmo',
        accessControl: 'restricted',
      }),
    ).toBe(AccessLevel.Manage);
    expect(resolveProjectLevel({ ...base, appRole: 'admin' })).toBe(
      AccessLevel.Manage,
    );
  });

  it('open projects are viewable by any signed-in user', () => {
    expect(resolveProjectLevel(base)).toBe(AccessLevel.View);
    expect(resolveProjectLevel({ ...base, appRole: 'executive' })).toBe(
      AccessLevel.View,
    );
  });

  it('restricted projects grant nothing without a relationship', () => {
    const restricted = { ...base, accessControl: 'restricted' };
    expect(resolveProjectLevel(restricted)).toBe(AccessLevel.None);
    // Executive drill-down into restricted is ASSUMED closed (OI question 3).
    expect(resolveProjectLevel({ ...restricted, appRole: 'executive' })).toBe(
      AccessLevel.None,
    );
  });

  it('maps the three membership tiers onto view/write/manage', () => {
    const restricted = { ...base, accessControl: 'restricted' };
    expect(
      resolveProjectLevel({ ...restricted, membershipLevel: 'read_only' }),
    ).toBe(AccessLevel.View);
    expect(
      resolveProjectLevel({ ...restricted, membershipLevel: 'read_write' }),
    ).toBe(AccessLevel.Write);
    expect(
      resolveProjectLevel({
        ...restricted,
        membershipLevel: 'read_write_admin',
      }),
    ).toBe(AccessLevel.Manage);
  });

  it('owner manages; PMs and PMO Partner write, even on restricted', () => {
    const restricted = { ...base, accessControl: 'restricted' };
    expect(resolveProjectLevel({ ...restricted, ownerId: 'u-1' })).toBe(
      AccessLevel.Manage,
    );
    expect(
      resolveProjectLevel({ ...restricted, projectManagerId: 'u-1' }),
    ).toBe(AccessLevel.Write);
    expect(
      resolveProjectLevel({ ...restricted, projectManager2Id: 'u-1' }),
    ).toBe(AccessLevel.Write);
    expect(resolveProjectLevel({ ...restricted, pmoPartnerId: 'u-1' })).toBe(
      AccessLevel.Write,
    );
  });

  it('takes the max when several sources apply', () => {
    // read_only member who is also the owner: ownership wins.
    expect(
      resolveProjectLevel({
        ...base,
        membershipLevel: 'read_only',
        ownerId: 'u-1',
      }),
    ).toBe(AccessLevel.Manage);
    // A PM whose membership row says read_only still writes.
    expect(
      resolveProjectLevel({
        ...base,
        membershipLevel: 'read_only',
        projectManagerId: 'u-1',
      }),
    ).toBe(AccessLevel.Write);
  });

  it('ignores an unknown membership tier beyond view', () => {
    expect(
      resolveProjectLevel({
        ...base,
        accessControl: 'restricted',
        membershipLevel: 'mystery_tier',
      }),
    ).toBe(AccessLevel.View);
  });
});

describe('defaultLevelFor', () => {
  it('GET views, everything else writes', () => {
    expect(defaultLevelFor('GET')).toBe(AccessLevel.View);
    expect(defaultLevelFor('POST')).toBe(AccessLevel.Write);
    expect(defaultLevelFor('PATCH')).toBe(AccessLevel.Write);
    expect(defaultLevelFor('DELETE')).toBe(AccessLevel.Write);
  });
});
