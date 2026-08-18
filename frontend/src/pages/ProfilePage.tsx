import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, KeyRound, Loader2 } from 'lucide-react'
import {
  usersApi,
  type MyMembership,
  type MyWork,
} from '@/lib/api'
import { refreshMe, useMe } from '@/lib/use-me'
import { supabase } from '@/lib/supabase'
import { dueIn } from '@/lib/format'
import { usePageTitle } from '@/lib/use-page-title'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { InitialsAvatar } from '@/components/InitialsAvatar'

const ROLE_LABEL: Record<string, string> = {
  admin: 'System Administrator',
  pmo: 'PMO Administrator',
  executive: 'Executive Viewer',
  user: 'User',
}

// Mirrors the backend capability catalog labels (access.logic.ts) — the
// grid remains the source of truth; this only names the keys for display.
const CAPABILITY_LABEL: Record<string, string> = {
  'projects.create': 'Create projects',
  'cycles.close': 'Close / reopen cycles',
  'kpis.manage': 'Manage KPIs',
  'templates.instantiate': 'Create from templates',
  'lookups.manage': 'Manage code tables',
  'import.run': 'Run CSV imports',
  'users.provision': 'Provision accounts',
  'users.manage_roles': 'Manage roles & permissions',
}

const ACCESS_LABEL: Record<string, string> = {
  read_only: 'Read only',
  read_write: 'Read / write',
  read_write_admin: 'Read / write / admin',
}

function IdentityCard() {
  const me = useMe()
  const [name, setName] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const value = name ?? me?.full_name ?? ''
  const dirty = name !== null && name.trim() !== (me?.full_name ?? '')

  async function save() {
    setSaving(true)
    try {
      await usersApi.updateMe(value.trim())
      await refreshMe()
      setName(null)
      toast.success('Profile updated.')
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-lg border bg-card p-5 shadow-xs">
      <div className="flex items-center gap-4">
        <InitialsAvatar
          name={me?.full_name || me?.email || '…'}
          className="scale-150"
        />
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold">
            {me?.full_name || me?.email || '…'}
          </h1>
          <p className="truncate text-sm text-muted-foreground">{me?.email}</p>
        </div>
        <span className="ml-auto rounded-full border border-status-blue-border bg-status-blue-bg px-2.5 py-0.5 text-xs font-medium text-status-blue-fg">
          {ROLE_LABEL[me?.app_role ?? 'user']}
        </span>
      </div>

      <div className="mt-5 flex max-w-md flex-col gap-2">
        <Label htmlFor="profile-name">Display name</Label>
        <div className="flex gap-2">
          <Input
            id="profile-name"
            placeholder={me?.email ?? 'Your name'}
            value={value}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && dirty && value.trim()) void save()
            }}
          />
          <Button onClick={save} disabled={!dirty || !value.trim() || saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Shown in change history, notifications, and people pickers.
        </p>
      </div>

      {me && me.capabilities.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            My permissions
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {me.capabilities.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                <Check className="h-3 w-3" />
                {CAPABILITY_LABEL[c] ?? c}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function MembershipsCard() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<MyMembership[] | null>(null)

  useEffect(() => {
    usersApi
      .myMemberships()
      .then(setRows)
      .catch((e: Error) => toast.error(e.message))
  }, [])

  return (
    <section className="rounded-lg border bg-card p-5 shadow-xs">
      <h2 className="text-sm font-semibold">My projects</h2>
      {!rows ? (
        <Skeleton className="mt-3 h-24 w-full rounded-md" />
      ) : rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          You are not a member of any project yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y rounded-md border">
          {rows.map((m, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-2.5">
              <button
                type="button"
                onClick={() =>
                  m.project && navigate(`/projects/${m.project.id}`)
                }
                className="min-w-0 flex-1 truncate text-left text-sm font-medium hover:underline"
              >
                {m.project?.name ?? 'Unknown project'}
              </button>
              {m.role?.name && (
                <span className="text-xs text-muted-foreground">
                  {m.role.name}
                </span>
              )}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {ACCESS_LABEL[m.access_level] ?? m.access_level}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function WorkCard() {
  const navigate = useNavigate()
  const [work, setWork] = useState<MyWork | null>(null)

  useEffect(() => {
    usersApi
      .myWork()
      .then(setWork)
      .catch((e: Error) => toast.error(e.message))
  }, [])

  const empty =
    work &&
    work.action_items.length === 0 &&
    work.milestones.length === 0 &&
    work.risks.length === 0

  return (
    <section className="rounded-lg border bg-card p-5 shadow-xs">
      <h2 className="text-sm font-semibold">My open work</h2>
      {!work ? (
        <Skeleton className="mt-3 h-24 w-full rounded-md" />
      ) : empty ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nothing assigned to you is open right now.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {work.action_items.length > 0 && (
            <WorkList
              label="Action items"
              rows={work.action_items.map((w) => ({
                key: w.id,
                text: w.title ?? '',
                meta: w.project?.name ?? '',
                due: w.due_date ?? null,
                onOpen: () =>
                  navigate(`/projects/${w.project_id}/action-items/${w.id}`),
              }))}
            />
          )}
          {work.milestones.length > 0 && (
            <WorkList
              label="Milestones"
              rows={work.milestones.map((w) => ({
                key: w.id,
                text: w.name ?? '',
                meta: w.project?.name ?? '',
                due: w.due_date ?? null,
                onOpen: () =>
                  navigate(`/projects/${w.project_id}/milestones/${w.id}`),
              }))}
            />
          )}
          {work.risks.length > 0 && (
            <WorkList
              label="Risks & issues I own"
              rows={work.risks.map((w) => ({
                key: w.id,
                text: w.statement ?? '',
                meta: w.project?.name ?? '',
                due: null,
                onOpen: () => navigate(`/projects/${w.project_id}`),
              }))}
            />
          )}
        </div>
      )}
    </section>
  )
}

function WorkList({
  label,
  rows,
}: {
  label: string
  rows: Array<{
    key: string
    text: string
    meta: string
    due: string | null
    onOpen: () => void
  }>
}) {
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </h3>
      <ul className="mt-1.5 divide-y rounded-md border">
        {rows.map((r) => (
          <li key={r.key}>
            <button
              type="button"
              onClick={r.onOpen}
              className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left hover:bg-accent"
            >
              <span className="min-w-0 flex-1 truncate text-sm">{r.text}</span>
              <span className="hidden max-w-40 truncate text-xs text-muted-foreground sm:inline">
                {r.meta}
              </span>
              {r.due && (
                <span
                  className={`shrink-0 text-xs tabular-nums ${
                    r.due < today
                      ? 'font-medium text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {r.due} · {dueIn(r.due)}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PasswordCard() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setPassword('')
      setConfirm('')
      toast.success('Password changed.')
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const valid = password.length >= 8 && password === confirm

  return (
    <section className="rounded-lg border bg-card p-5 shadow-xs">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold">
        <KeyRound className="h-4 w-4 text-muted-foreground" />
        Change password
      </h2>
      <div className="mt-3 flex max-w-md flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
        <div>
          <Button onClick={save} disabled={!valid || saving}>
            {saving ? 'Changing…' : 'Change password'}
          </Button>
        </div>
      </div>
    </section>
  )
}

/** My profile: identity, permissions, memberships, open work, password. */
export function ProfilePage() {
  usePageTitle('My Profile')
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <IdentityCard />
      <MembershipsCard />
      <WorkCard />
      <PasswordCard />
    </div>
  )
}
