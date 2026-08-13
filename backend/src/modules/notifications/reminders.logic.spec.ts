import {
  classifyDue,
  inSubmissionWindow,
  reminderType,
  resolveRecipients,
  submissionPendingType,
} from './reminders.logic';

const TODAY = '2026-08-07';
const TOMORROW = '2026-08-08';

describe('classifyDue', () => {
  it('flags past due dates as overdue', () => {
    expect(classifyDue('2026-08-06', TODAY, TOMORROW)).toBe('overdue');
    expect(classifyDue('2025-12-31', TODAY, TOMORROW)).toBe('overdue');
  });

  it('flags today and tomorrow as due_soon', () => {
    expect(classifyDue(TODAY, TODAY, TOMORROW)).toBe('due_soon');
    expect(classifyDue(TOMORROW, TODAY, TOMORROW)).toBe('due_soon');
  });

  it('ignores dates further out', () => {
    expect(classifyDue('2026-08-09', TODAY, TOMORROW)).toBeNull();
    expect(classifyDue('2027-01-01', TODAY, TOMORROW)).toBeNull();
  });
});

describe('reminderType', () => {
  it('embeds kind, record, and due date so replans re-arm the reminder', () => {
    expect(reminderType('overdue', 'milestone', 'abc', '2026-08-01')).toBe(
      'reminder:overdue:milestone:abc:2026-08-01',
    );
    expect(
      reminderType('due_soon', 'action_item', 'abc', '2026-09-01'),
    ).not.toBe(reminderType('due_soon', 'action_item', 'abc', '2026-08-01'));
  });
});

describe('inSubmissionWindow', () => {
  it('opens for the last five days of the month', () => {
    expect(inSubmissionWindow('2026-08-27')).toBe(true);
    expect(inSubmissionWindow('2026-08-31')).toBe(true);
    expect(inSubmissionWindow('2026-08-26')).toBe(false);
    expect(inSubmissionWindow('2026-08-01')).toBe(false);
  });

  it('respects short months (Feb) and a custom window size', () => {
    expect(inSubmissionWindow('2026-02-24')).toBe(true);
    expect(inSubmissionWindow('2026-02-23')).toBe(false);
    expect(inSubmissionWindow('2026-08-20', 12)).toBe(true);
  });
});

describe('submissionPendingType', () => {
  it('embeds project and cycle so a new month re-arms the nudge', () => {
    expect(submissionPendingType('p1', '2026-08-01')).toBe(
      'reminder:submission_pending:project:p1:2026-08-01',
    );
    expect(submissionPendingType('p1', '2026-09-01')).not.toBe(
      submissionPendingType('p1', '2026-08-01'),
    );
  });
});

describe('resolveRecipients', () => {
  it('returns all explicit owners, deduped, ignoring gaps', () => {
    expect(resolveRecipients(['u1', null, 'u2', 'u1'], ['pm'])).toEqual([
      'u1',
      'u2',
    ]);
  });

  it('falls back in order: project manager, then project owner', () => {
    expect(resolveRecipients([null], ['pm', 'own'])).toEqual(['pm']);
    expect(resolveRecipients([], [null, 'own'])).toEqual(['own']);
  });

  it('returns empty when nobody is set (reminder skipped)', () => {
    expect(resolveRecipients([null, undefined], [null, undefined])).toEqual([]);
  });
});
