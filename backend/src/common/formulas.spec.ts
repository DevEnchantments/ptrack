import { calculatedProgress, plannedProgress } from './formulas';

describe('F1 calculatedProgress', () => {
  it('returns null with no milestones', () => {
    expect(calculatedProgress([])).toBeNull();
  });

  it('excludes not_applicable milestones', () => {
    expect(
      calculatedProgress([
        { status: 'not_applicable', weightage: null, percent_complete: 100 },
      ]),
    ).toBeNull();
  });

  it('averages equally when no weights are set', () => {
    expect(
      calculatedProgress([
        { status: 'open', weightage: null, percent_complete: 50 },
        { status: 'open', weightage: null, percent_complete: 100 },
      ]),
    ).toBe(75);
  });

  it('uses weights when any are set (null weight counts 0)', () => {
    expect(
      calculatedProgress([
        { status: 'open', weightage: 80, percent_complete: 100 },
        { status: 'open', weightage: 20, percent_complete: 0 },
        { status: 'open', weightage: null, percent_complete: 100 },
      ]),
    ).toBe(80);
  });

  it('treats null percent as 100 only when closed_completed', () => {
    expect(
      calculatedProgress([
        { status: 'closed_completed', weightage: null, percent_complete: null },
        { status: 'open', weightage: null, percent_complete: null },
      ]),
    ).toBe(50);
  });

  it('clamps out-of-range percents', () => {
    expect(
      calculatedProgress([
        { status: 'open', weightage: null, percent_complete: 150 },
      ]),
    ).toBe(100);
  });
});

describe('F2 plannedProgress', () => {
  it('is null without both dates or with inverted dates', () => {
    expect(plannedProgress(null, '2026-12-31')).toBeNull();
    expect(plannedProgress('2026-01-01', null)).toBeNull();
    expect(plannedProgress('2026-12-31', '2026-01-01')).toBeNull();
  });

  it('is 0 before start and 100 after end', () => {
    expect(plannedProgress('2026-06-01', '2026-12-01', '2026-01-01')).toBe(0);
    expect(plannedProgress('2026-01-01', '2026-06-01', '2026-12-01')).toBe(100);
  });

  it('is proportional in between', () => {
    expect(plannedProgress('2026-01-01', '2026-01-11', '2026-01-06')).toBe(50);
  });
});
