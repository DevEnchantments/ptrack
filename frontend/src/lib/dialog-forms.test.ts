import { describe, it, expect } from 'vitest'
import { parseTags } from './forms'
import { linkFormErrors, linkFormPayload, type LinkFormValues } from './link-form'
import {
  resourceFormErrors,
  resourceFormPayload,
  type ResourceFormValues,
} from './resource-form'
import {
  updateFormErrors,
  updateFormPayload,
  type UpdateFormValues,
} from './update-form'
import {
  issueFormErrors,
  issueFormPayload,
  type IssueFormValues,
} from './issue-form'

/**
 * Characterization tests (REFACTOR-PLAN v2, Phase 2) for the dialog rules
 * extracted out of four submit handlers. Everything here was previously
 * reachable only by driving the UI.
 */

describe('parseTags', () => {
  it('splits on commas and trims', () => {
    expect(parseTags(' migration , q3 ')).toEqual(['migration', 'q3'])
  })

  it('drops empties from doubled or trailing commas', () => {
    expect(parseTags('migration,,q3,')).toEqual(['migration', 'q3'])
  })

  it('returns nothing for a blank field', () => {
    expect(parseTags('   ')).toEqual([])
  })
})

describe('link form', () => {
  const values = (over: Partial<LinkFormValues> = {}): LinkFormValues => ({
    url: 'https://intranet.example.com/runbook',
    label: '',
    description: '',
    isGold: false,
    tags: '',
    ...over,
  })

  it('accepts an http or https url', () => {
    expect(linkFormErrors(values())).toEqual({})
    expect(linkFormErrors(values({ url: 'http://x.example.com' }))).toEqual({})
  })

  it('rejects a url that is not absolute', () => {
    expect(linkFormErrors(values({ url: 'intranet/page' })).url).toMatch(
      /must start with http/,
    )
  })

  it('tells a user with an empty url that it must start with http', () => {
    // Surprising but current: the blank check sets "A URL is required." and
    // the pattern check immediately overwrites it. Pinned rather than fixed,
    // because changing it changes what a user reads.
    expect(linkFormErrors(values({ url: '   ' })).url).toBe(
      'URL must start with http:// or https://',
    )
  })

  it('omits optional text rather than sending empty strings', () => {
    const payload = linkFormPayload(values({ label: '  ', description: ' ' }))
    expect(payload.label).toBeUndefined()
    expect(payload.description).toBeUndefined()
  })

  it('trims the url it sends', () => {
    expect(linkFormPayload(values({ url: '  https://x.example.com  ' })).url).toBe(
      'https://x.example.com',
    )
  })
})

describe('resource form', () => {
  const values = (over: Partial<ResourceFormValues> = {}): ResourceFormValues => ({
    name: 'Marine consultant',
    typeId: 't-1',
    notes: '',
    ...over,
  })

  it('requires a name and a type', () => {
    expect(resourceFormErrors(values({ name: ' ', typeId: null }))).toEqual({
      name: 'A resource name is required.',
      typeId: 'A type is required.',
    })
  })

  it('sends notes as the description column, omitted when blank', () => {
    expect(resourceFormPayload(values({ notes: '  Diver  ' })).description).toBe(
      'Diver',
    )
    expect(resourceFormPayload(values()).description).toBeUndefined()
  })
})

describe('update form', () => {
  const values = (over: Partial<UpdateFormValues> = {}): UpdateFormValues => ({
    body: 'Cutover rehearsal done.',
    typeId: null,
    isGold: false,
    tags: '',
    ...over,
  })

  it('requires a body that is not just spaces', () => {
    expect(updateFormErrors(values({ body: '   ' })).body).toBe(
      'An update is required.',
    )
  })

  it('clears tags with null where other dialogs omit them', () => {
    // Same backend, different meaning: absent leaves tags alone, null clears
    // them. Pinned as the inconsistency it is (FOLLOW-UPS F4 territory).
    expect(updateFormPayload(values()).tags).toBeNull()
    expect(updateFormPayload(values({ tags: 'risk' })).tags).toEqual(['risk'])
  })
})

describe('issue form', () => {
  const values = (over: Partial<IssueFormValues> = {}): IssueFormValues => ({
    title: 'Crane unavailable',
    roleId: null,
    ownerId: null,
    status: 'open',
    levelId: null,
    categoryId: null,
    description: '',
    url: '',
    referenceId: '',
    tags: '',
    resolution: '',
    recommendation: '',
    reportedBy: '',
    dateClosed: '',
    ...over,
  })

  it('requires a title', () => {
    expect(issueFormErrors(values({ title: '  ' })).title).toBe(
      'An issue title is required.',
    )
  })

  it('requires a resolution before an issue may be closed', () => {
    expect(issueFormErrors(values({ status: 'closed' })).resolution).toMatch(
      /required when the issue is closed/,
    )
    expect(
      issueFormErrors(values({ status: 'closed', resolution: 'Rescheduled' })),
    ).toEqual({})
  })

  it('does not require a resolution on an open issue', () => {
    expect(issueFormErrors(values({ resolution: '' }))).toEqual({})
  })

  it('drops a resolution typed against an issue that is not closed', () => {
    // Otherwise a resolution written and then reopened would linger,
    // describing an ending that did not happen.
    expect(
      issueFormPayload(values({ status: 'open', resolution: 'Rescheduled' }))
        .resolution,
    ).toBeNull()
    expect(
      issueFormPayload(values({ status: 'closed', resolution: ' Rescheduled ' }))
        .resolution,
    ).toBe('Rescheduled')
  })

  it('nulls blank optional text rather than omitting it', () => {
    const payload = issueFormPayload(values())
    expect(payload.description).toBeNull()
    expect(payload.url).toBeNull()
    expect(payload.reference_identifier).toBeNull()
    expect(payload.date_closed).toBeNull()
  })
})
