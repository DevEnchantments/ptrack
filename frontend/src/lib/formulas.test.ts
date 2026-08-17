import { describe, expect, it } from 'vitest'
import {
  atRiskSuggested,
  calculatedProgress,
  plannedProgress,
  riskScore,
  riskSeverityTone,
} from './formulas'

/**
 * First tests that pin main's own behaviour (the format.ts suite proves the
 * runner; this proves the formulas). All formulas are PROVISIONAL per
 * docs/FORMULAS.md — if a definition changes on sign-off, these change with it.
 */

const ms = (
  status: string,
  weightage: number | null = null,
  percent: number | null = null,
) => ({ status, weightage, percent_complete: percent })

describe('calculatedProgress (F1)', () => {
  it('is null with no milestones or only not_applicable ones', () => {
    expect(calculatedProgress([])).toBeNull()
    expect(calculatedProgress([ms('not_applicable', 50, 50)])).toBeNull()
  })

  it('averages unweighted milestones equally', () => {
    expect(
      calculatedProgress([ms('open', null, 100), ms('open', null, 0)]),
    ).toBe(50)
  })

  it('weights milestones when any weight is set, dropping zero-weight rows', () => {
    // 75 carries all the weight; the unweighted row counts for nothing.
    expect(
      calculatedProgress([ms('open', 100, 75), ms('open', null, 0)]),
    ).toBe(75)
  })

  it('falls back to 100 for completed milestones without a percent', () => {
    expect(
      calculatedProgress([ms('closed_completed'), ms('open')]),
    ).toBe(50)
  })

  it('clamps out-of-range percentages into 0-100', () => {
    expect(calculatedProgress([ms('open', null, 150)])).toBe(100)
    expect(calculatedProgress([ms('open', null, -20)])).toBe(0)
  })
})

describe('plannedProgress (F2)', () => {
  it('is null without both dates or with an inverted range', () => {
    expect(plannedProgress(null, '2026-12-31')).toBeNull()
    expect(plannedProgress('2026-01-01', null)).toBeNull()
    expect(plannedProgress('2026-12-31', '2026-01-01')).toBeNull()
  })

  it('pins 0 before the start and 100 after the target end', () => {
    expect(plannedProgress('2026-01-01', '2026-12-31', '2025-06-01')).toBe(0)
    expect(plannedProgress('2026-01-01', '2026-12-31', '2027-01-01')).toBe(100)
  })

  it('is straight-line in between', () => {
    expect(plannedProgress('2026-01-01', '2026-01-11', '2026-01-06')).toBe(50)
  })
})

describe('riskScore + riskSeverityTone (F3)', () => {
  it('is null unless both probability and impact have sort orders', () => {
    expect(riskScore(null, { sort_order: 3 })).toBeNull()
    expect(riskScore({ sort_order: 3 }, { sort_order: null })).toBeNull()
  })

  it('multiplies the 1-3 scales into 1-9', () => {
    expect(riskScore({ sort_order: 2 }, { sort_order: 3 })).toBe(6)
  })

  it('bands scores green below 3, amber to 5, red from 6', () => {
    expect(riskSeverityTone(2)).toBe('green')
    expect(riskSeverityTone(3)).toBe('amber')
    expect(riskSeverityTone(5)).toBe('amber')
    expect(riskSeverityTone(6)).toBe('red')
    expect(riskSeverityTone(9)).toBe('red')
  })
})

describe('atRiskSuggested (F4)', () => {
  const TODAY = '2026-08-17'

  it('flags an open milestone past its due date', () => {
    expect(
      atRiskSuggested(
        [{ status: 'open', due_date: '2026-08-01' }],
        null,
        null,
        TODAY,
      ),
    ).toBe(true)
  })

  it('does not flag overdue milestones that are closed', () => {
    expect(
      atRiskSuggested(
        [{ status: 'closed_completed', due_date: '2026-08-01' }],
        50,
        50,
        TODAY,
      ),
    ).toBe(false)
  })

  it('flags progress more than 15 points behind plan, exclusive', () => {
    expect(atRiskSuggested([], 30, 50, TODAY)).toBe(true)
    expect(atRiskSuggested([], 35, 50, TODAY)).toBe(false)
  })

  it('never flags when neither signal is computable', () => {
    expect(atRiskSuggested([], null, 50, TODAY)).toBe(false)
  })
})
