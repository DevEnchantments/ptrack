import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { usePageTitle } from '@/lib/use-page-title'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * The brand panel's miniature portfolio: gantt bars growing in like the real
 * Dashboard tab, a milestone diamond, a today line. Pure decoration on a
 * rarely-seen page, so the slower entrance is allowed; the global
 * prefers-reduced-motion block neutralizes it.
 */
const BARS: Array<{ width: string; color: string; delay: number; diamond?: boolean }> = [
  { width: '72%', color: 'var(--chart-3)', delay: 150 },
  { width: '48%', color: 'var(--chart-1)', delay: 240 },
  { width: '86%', color: 'var(--chart-4)', delay: 330, diamond: true },
  { width: '34%', color: 'var(--gold)', delay: 420 },
  { width: '60%', color: 'var(--chart-1)', delay: 510 },
]

function BrandPanel() {
  return (
    <div
      className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex"
      style={{
        background:
          'linear-gradient(160deg, var(--sidebar) 0%, var(--sidebar-deep) 100%)',
      }}
    >
      <div className="stagger-in flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sidebar-primary)] text-lg font-bold text-[var(--sidebar-primary-foreground)] shadow-md">
          P
        </span>
        <div>
          <p className="text-xl font-semibold text-white">P-Track</p>
          <p className="text-xs text-[var(--sidebar-foreground)]">
            Project portfolio management
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        {/* today line */}
        <div className="absolute inset-y-0 left-[62%] w-px bg-white/15" />
        <div className="flex flex-col gap-5">
          {BARS.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-white/25"
                aria-hidden
              />
              <div className="relative h-2.5 flex-1 overflow-visible rounded-full bg-white/10">
                <div
                  className="login-bar absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: b.width,
                    background: b.color,
                    animationDelay: `${b.delay}ms`,
                  }}
                />
                {b.diamond && (
                  <span
                    className="stagger-in absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-[2px] bg-[var(--gold)]"
                    style={{ left: b.width, animationDelay: '900ms' }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <p
          className="stagger-in mt-8 text-center text-sm text-[var(--sidebar-foreground)]"
          style={{ animationDelay: '600ms' }}
        >
          Plans, progress, and reporting — one portfolio, one place.
        </p>
      </div>

      <ul className="flex flex-col gap-2 text-sm text-[var(--sidebar-foreground)]">
        {[
          'Registers, milestones, and Gantt timelines',
          'Monthly reporting cycles with approvals',
          'Executive dashboards and printable reports',
        ].map((line, i) => (
          <li
            key={line}
            className="stagger-in flex items-center gap-2"
            style={{ animationDelay: `${700 + i * 70}ms` }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--sidebar-primary)]" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LoginPage() {
  usePageTitle('Sign in')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'signin' | 'forgot'>('signin')
  const [resetSent, setResetSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleForgot(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    // Neutral outcome either way — the form must not reveal which emails
    // have accounts.
    await supabase.auth
      .resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      .catch(() => undefined)
    setSubmitting(false)
    setResetSent(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[1.1fr_1fr]">
      <BrandPanel />

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Compact brand header where the panel is hidden */}
          <div className="stagger-in mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-md">
              P
            </span>
            <div>
              <p className="text-xl font-semibold">P-Track</p>
              <p className="text-xs text-muted-foreground">
                Project portfolio management
              </p>
            </div>
          </div>

          <h1
            className="stagger-in text-2xl font-semibold"
            style={{ animationDelay: '60ms' }}
          >
            {mode === 'forgot' ? 'Reset your password' : 'Welcome back'}
          </h1>
          <p
            className="stagger-in mt-1 text-sm text-muted-foreground"
            style={{ animationDelay: '110ms' }}
          >
            {mode === 'forgot'
              ? 'We will email you a reset link'
              : 'Sign in to your portfolio'}
          </p>

          {mode === 'forgot' ? (
            <form onSubmit={handleForgot} className="mt-8 flex flex-col gap-5">
              {resetSent ? (
                <div className="hint-in rounded-md border bg-card p-4 text-sm">
                  <p className="font-medium">Check your email</p>
                  <p className="mt-1 text-muted-foreground">
                    If an account exists for {email || 'that address'}, a
                    password-reset link is on its way. The link opens a page
                    where you choose a new password.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    PoC accounts (@poc.ptrack.local) have no inbox — ask your
                    administrator to reset those.
                  </p>
                </div>
              )}
              {!resetSent && (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full transition-transform active:scale-[0.98]"
                >
                  {submitting && <Loader2 className="animate-spin" />}
                  {submitting ? 'Sending…' : 'Send reset link'}
                </Button>
              )}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="cursor-pointer text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Back to sign in
              </button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div
              className="stagger-in flex flex-col gap-2"
              style={{ animationDelay: '160ms' }}
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                required
              />
            </div>
            <div
              className="stagger-in flex flex-col gap-2"
              style={{ animationDelay: '210ms' }}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot')
                    setResetSent(false)
                    setError(null)
                  }}
                  className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="hint-in text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="stagger-in w-full transition-transform active:scale-[0.98]"
              style={{ animationDelay: '260ms' }}
            >
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          )}

          <p
            className="stagger-in mt-8 text-center text-xs text-muted-foreground"
            style={{ animationDelay: '320ms' }}
          >
            Access is provisioned by your administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
