import { dayOffset, materializeOffset } from './templates.logic';

describe('dayOffset', () => {
  it('measures days from the base date, negative allowed', () => {
    expect(dayOffset('2026-03-11', '2026-03-01')).toBe(10);
    expect(dayOffset('2026-02-27', '2026-03-01')).toBe(-2);
    expect(dayOffset('2026-03-01', '2026-03-01')).toBe(0);
  });

  it('returns null when either side is missing or invalid', () => {
    expect(dayOffset(null, '2026-03-01')).toBeNull();
    expect(dayOffset('2026-03-11', null)).toBeNull();
    expect(dayOffset('garbage', '2026-03-01')).toBeNull();
  });
});

describe('materializeOffset', () => {
  it('shifts the base by the offset, crossing month/year bounds', () => {
    expect(materializeOffset('2026-03-01', 10)).toBe('2026-03-11');
    expect(materializeOffset('2026-12-20', 20)).toBe('2027-01-09');
    expect(materializeOffset('2026-03-01', 0)).toBe('2026-03-01');
  });

  it('round-trips with dayOffset', () => {
    const off = dayOffset('2026-05-15', '2026-03-01');
    expect(materializeOffset('2027-01-01', off)).toBe(
      materializeOffset('2027-01-01', 75),
    );
  });

  it('returns null when base or offset is missing', () => {
    expect(materializeOffset(null, 5)).toBeNull();
    expect(materializeOffset('2026-03-01', null)).toBeNull();
  });
});
