import { describe, it, expect } from 'vitest'
import {
  milestoneFormErrors,
  milestoneFormPayload,
  parseTags,
  type MilestoneFormValues,
} from './milestone-form'

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 2). These pin what the
 * milestone dialog does TODAY, now that its rules are reachable without
 * driving the UI.
 *
 * The rules are all about strings: a form has no booleans, no numbers and no
 * arrays, so every one of them is a decision about how to read text.
 */

const values = (over: Partial<MilestoneFormValues> = {}): MilestoneFormValues => ({
  name: 'Cutover',
  startDate: '2026-08-01',
  dueDate: '2026-08-31',
  status: 'open',
  roleId: null,
  ownerId: null,
  isMajor: 'false',
  description: '',
  tags: '',
  weightage: '',
  percent: '',
  dependsOn: [],
  ...over,
})

describe('milestoneFormErrors', () => {
  it('accepts a filled-in form', () => {
    expect(milestoneFormErrors(values())).toEqual({})
  })

  it('requires a name that is not just spaces', () => {
    expect(milestoneFormErrors(values({ name: '   ' }))).toEqual({
      name: 'A milestone name is required.',
    })
  })

  it('requires both dates, reporting them together', () => {
    expect(
      milestoneFormErrors(values({ startDate: '', dueDate: '' })),
    ).toEqual({
      startDate: 'A start date is required.',
      dueDate: 'A due date is required.',
    })
  })

  it('does not check that the due date follows the start date', () => {
    // Pinned as current behaviour, not endorsed: the dialog will happily
    // submit a milestone due before it starts, and the server does not
    // reject it either.
    expect(
      milestoneFormErrors(
        values({ startDate: '2026-08-31', dueDate: '2026-08-01' }),
      ),
    ).toEqual({})
  })
})

describe('parseTags', () => {
  it('splits on commas and trims each tag', () => {
    expect(parseTags(' migration , q3 ')).toEqual(['migration', 'q3'])
  })

  it('drops empty entries from trailing or doubled commas', () => {
    expect(parseTags('migration,,q3,')).toEqual(['migration', 'q3'])
  })

  it('returns nothing for a blank field', () => {
    expect(parseTags('   ')).toEqual([])
  })
})

describe('milestoneFormPayload', () => {
  it('trims the name and passes the dates through', () => {
    const payload = milestoneFormPayload(values({ name: '  Cutover  ' }), null)

    expect(payload.name).toBe('Cutover')
    expect(payload.start_date).toBe('2026-08-01')
    expect(payload.due_date).toBe('2026-08-31')
  })

  it('reads the major flag from the string the select holds', () => {
    // The radio group stores "true"/"false" as text, so this comparison is
    // the only thing standing between a boolean column and always-false.
    expect(milestoneFormPayload(values({ isMajor: 'true' }), null).is_major).toBe(
      true,
    )
    expect(
      milestoneFormPayload(values({ isMajor: 'false' }), null).is_major,
    ).toBe(false)
  })

  it('omits optional text rather than sending an empty string', () => {
    // undefined means "leave it alone" to the backend's patch builders, where
    // null would mean "clear it".
    const payload = milestoneFormPayload(
      values({ description: '   ', tags: '  ' }),
      null,
    )

    expect(payload.description).toBeUndefined()
    expect(payload.tags).toBeUndefined()
  })

  it('sends numbers only when the field was filled in', () => {
    expect(milestoneFormPayload(values(), null).weightage).toBeUndefined()
    expect(
      milestoneFormPayload(values({ weightage: '40', percent: '0' }), null),
    ).toEqual(expect.objectContaining({ weightage: 40, percent_complete: 0 }))
  })

  it('keeps a zero percent, which is a real value rather than a blank', () => {
    expect(
      milestoneFormPayload(values({ percent: '0' }), null).percent_complete,
    ).toBe(0)
  })

  it('passes the outcome id through, including a deliberate clear', () => {
    expect(milestoneFormPayload(values(), 'o-1').outcome_id).toBe('o-1')
    expect(milestoneFormPayload(values(), null).outcome_id).toBeNull()
  })

  it('sends dependencies as given, empty list included', () => {
    // An empty array is meaningful here: the backend reads it as "clear the
    // dependency set" on update.
    expect(milestoneFormPayload(values(), null).depends_on).toEqual([])
    expect(
      milestoneFormPayload(values({ dependsOn: ['m-9'] }), null).depends_on,
    ).toEqual(['m-9'])
  })
})
