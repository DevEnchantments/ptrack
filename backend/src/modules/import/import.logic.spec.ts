import {
  INVALID,
  parseBoolValue,
  parseDateValue,
  parseMilestoneStatus,
  parseNumberValue,
  resolveLookup,
} from './import.logic';

const OPTIONS = [
  { id: 'a', name: 'In Progress' },
  { id: 'b', name: 'On Hold' },
];

describe('resolveLookup', () => {
  it('matches case-insensitively with whitespace tolerance', () => {
    expect(resolveLookup('in progress', OPTIONS).id).toBe('a');
    expect(resolveLookup('  ON HOLD ', OPTIONS).id).toBe('b');
  });

  it('reports unmatched values without failing', () => {
    expect(resolveLookup('Blocked', OPTIONS)).toEqual({
      id: null,
      unmatched: 'Blocked',
    });
  });

  it('treats empty as no value, not unmatched', () => {
    expect(resolveLookup('', OPTIONS)).toEqual({ id: null, unmatched: null });
    expect(resolveLookup(undefined, OPTIONS).unmatched).toBeNull();
  });
});

describe('parseDateValue', () => {
  it('passes ISO through and converts dd/mm/yyyy', () => {
    expect(parseDateValue('2026-09-01')).toBe('2026-09-01');
    expect(parseDateValue('1/9/2026')).toBe('2026-09-01');
  });

  it('flags garbage as invalid but empty as null', () => {
    expect(parseDateValue('September 1st')).toBe(INVALID);
    expect(parseDateValue('2026-13-45')).toBe(INVALID);
    expect(parseDateValue('')).toBeNull();
  });
});

describe('parseNumberValue', () => {
  it('strips separators and rejects non-numbers', () => {
    expect(parseNumberValue('1,200,000')).toBe(1200000);
    expect(parseNumberValue('45.5')).toBe(45.5);
    expect(parseNumberValue('abc')).toBe(INVALID);
    expect(parseNumberValue('')).toBeNull();
  });
});

describe('parseBoolValue / parseMilestoneStatus', () => {
  it('reads spreadsheet-style booleans', () => {
    expect(parseBoolValue('Yes')).toBe(true);
    expect(parseBoolValue('x')).toBe(true);
    expect(parseBoolValue('no')).toBe(false);
    expect(parseBoolValue('')).toBe(false);
  });

  it('maps friendly status words, defaulting to open', () => {
    expect(parseMilestoneStatus('Completed')).toBe('closed_completed');
    expect(parseMilestoneStatus('N/A')).toBe('not_applicable');
    expect(parseMilestoneStatus('whatever')).toBe('open');
    expect(parseMilestoneStatus(undefined)).toBe('open');
  });
});
