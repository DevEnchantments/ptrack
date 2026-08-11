/** Account-provisioning helpers (PoC email generator, temp passwords,
 *  invitation draft). Non-component exports live here per house rules. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const POC_DOMAIN = '@poc.ptrack.local'

/** PoC placeholder accounts: fake domain, nobody logs in or gets mail. */
export function isPocEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(POC_DOMAIN)
}

/** Clearly-fake unique email for proof-of-concept accounts (emails must be
 *  unique in Supabase Auth; the .local TLD can never receive real mail). */
export function pocEmail(name: string): string {
  const slug =
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '') || 'user'
  const rand = Math.random().toString(36).slice(2, 6)
  return `${slug}.${rand}@poc.ptrack.local`
}

/** Random temporary password (unambiguous characters, 13 chars). */
export function tempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  const arr = new Uint32Array(10)
  crypto.getRandomValues(arr)
  return 'Pt-' + [...arr].map((n) => chars[n % chars.length]).join('')
}

/** Suggested invitation message from project context. Fully editable in the
 *  dialog; becomes the AI-drafted starting point once an LLM key exists. */
export function inviteDraft(opts: {
  name: string
  email: string
  password: string
  projectName?: string | null
}): string {
  const firstName = opts.name.trim().split(/\s+/)[0] || 'there'
  const where = opts.projectName
    ? `the "${opts.projectName}" project on P-Track`
    : 'P-Track'
  return [
    `Hi ${firstName},`,
    '',
    `You've been added to ${where}, our project portfolio tracker.`,
    '',
    `Sign in at ${window.location.origin} with:`,
    `  Email: ${opts.email}`,
    `  Temporary password: ${opts.password}`,
    '',
    'Please change your password after your first sign-in. Your pending assignments will be linked to your account automatically.',
    '',
    'Thanks,',
  ].join('\n')
}
