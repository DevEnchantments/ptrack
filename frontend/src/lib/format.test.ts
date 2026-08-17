import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatDate, initials, personName, relativeTime } from './format'

/**
 * Node caches the timezone, and `vi.unstubAllEnvs()` does not reliably reset
 * it once a Date has been constructed. So every timezone-sensitive test sets
 * its own TZ rather than assuming the ambient one — otherwise the first test
 * to stub TZ silently dictates the result of every test after it.
 */
function withTZ(tz: string, fn: () => void) {
  vi.stubEnv('TZ', tz)
  fn()
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('formatDate', () => {
  it('renders the house DD-MON-YYYY format', () => {
    withTZ('UTC', () => {
      expect(formatDate('2026-07-07')).toBe('07-JUL-2026')
    })
  })

  it('zero-pads single-digit days', () => {
    withTZ('UTC', () => {
      expect(formatDate('2026-12-01')).toBe('01-DEC-2026')
    })
  })

  /**
   * The reason this function exists. A bare YYYY-MM-DD parses as UTC per spec,
   * so west of Greenwich `new Date('2026-07-07')` renders as 06-JUL. Date-only
   * input must be pinned to local midnight.
   */
  it('does not shift a date-only string in any timezone', () => {
    for (const tz of [
      'UTC',
      'America/Los_Angeles', // UTC-7, the case that used to render 06-JUL
      'Asia/Dubai', // UTC+4
      'Pacific/Kiritimati', // UTC+14, the far edge
    ]) {
      withTZ(tz, () => {
        expect(formatDate('2026-07-07')).toBe('07-JUL-2026')
      })
    }
  })

  it('treats a full timestamp as an instant, not a date-only string', () => {
    // Midday UTC stays on the 7th anywhere from UTC-11 to UTC+11.
    withTZ('Asia/Dubai', () => {
      expect(formatDate('2026-07-07T12:00:00.000Z')).toBe('07-JUL-2026')
    })
  })

  it('returns unparseable input untouched rather than "Invalid Date"', () => {
    expect(formatDate('not a date')).toBe('not a date')
  })

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('')
  })
})

describe('initials', () => {
  it('takes the first letter of the first two words', () => {
    expect(initials('Ada Lovelace')).toBe('AL')
  })

  it('takes two letters from a single name', () => {
    expect(initials('Ada')).toBe('AD')
  })

  it('ignores extra whitespace', () => {
    expect(initials('  Ada   Lovelace  ')).toBe('AL')
  })

  it('ignores words past the second', () => {
    expect(initials('Ada King Lovelace')).toBe('AK')
  })

  it('falls back to ? for an empty name', () => {
    expect(initials('   ')).toBe('?')
  })
})

describe('personName', () => {
  it('prefers the full name', () => {
    expect(personName({ full_name: 'Ada Lovelace', email: 'ada@x.com' })).toBe(
      'Ada Lovelace',
    )
  })

  it('falls back to the email when there is no name', () => {
    expect(personName({ full_name: null, email: 'ada@x.com' })).toBe('ada@x.com')
  })

  it('treats a blank name as missing', () => {
    // `||` not `??` — this is why the two are not interchangeable here.
    expect(personName({ full_name: '', email: 'ada@x.com' })).toBe('ada@x.com')
  })

  it('defaults to Unknown for a missing person', () => {
    expect(personName(null)).toBe('Unknown')
    expect(personName(undefined)).toBe('Unknown')
    expect(personName({ full_name: null, email: null })).toBe('Unknown')
  })

  it('takes any fallback the caller needs, including null', () => {
    expect(personName(null, '')).toBe('')
    expect(personName(null, null)).toBeNull()
    expect(personName(null, 'Dana Whitfield')).toBe('Dana Whitfield')
  })
})

describe('relativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  const base = '2026-07-07T12:00:00.000Z'

  function atOffset(offsetMs: number) {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(new Date(base).getTime() + offsetMs))
    return relativeTime(base)
  }

  it('says "just now" for anything under a minute', () => {
    expect(atOffset(1_000)).toBe('just now')
    expect(atOffset(5_000)).toBe('just now')
    expect(atOffset(59_000)).toBe('just now')
  })

  it('singularises', () => {
    expect(atOffset(60_000)).toBe('1 minute ago')
  })

  it('rolls up to minutes, hours and days', () => {
    expect(atOffset(5 * 60_000)).toBe('5 minutes ago')
    expect(atOffset(3 * 3_600_000)).toBe('3 hours ago')
    expect(atOffset(3 * 86_400_000)).toBe('3 days ago')
  })

  it('rolls up to months and years', () => {
    expect(atOffset(60 * 86_400_000)).toBe('2 months ago')
    expect(atOffset(400 * 86_400_000)).toBe('1 year ago')
  })
})
