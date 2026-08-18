import { useState, type FormEvent } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { usePageTitle } from '@/lib/use-page-title'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Lands here from the password-recovery email. The link carries tokens the
 * Supabase client picks out of the URL automatically, which signs the user
 * in just enough to call updateUser — so this page only needs the session
 * from useAuth and a new-password form. No session = expired/direct visit.
 */
export function ResetPasswordPage() {
  usePageTitle('Choose a new password')
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  const valid = password.length >= 8 && password === confirm

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password changed — you are signed in.')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="animate-step-in w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
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

        {loading ? (
          <Skeleton className="h-48 w-full rounded-md" />
        ) : !session ? (
          <div className="rounded-md border bg-card p-5">
            <h1 className="text-lg font-semibold">Link expired or invalid</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Password-reset links work once and expire quickly. Request a new
              one from the sign-in page.
            </p>
            <Button className="mt-4" onClick={() => navigate('/login')}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold">
                <KeyRound className="h-5 w-5 text-muted-foreground" />
                Choose a new password
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                for {session.user.email}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-destructive">
                Passwords must be at least 8 characters.
              </p>
            )}
            {confirm.length > 0 && password !== confirm && (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            )}
            <Button
              type="submit"
              disabled={!valid || saving}
              className="w-full transition-transform active:scale-[0.98]"
            >
              {saving && <Loader2 className="animate-spin" />}
              {saving ? 'Saving…' : 'Set new password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
