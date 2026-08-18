import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  Flag,
  FolderKanban,
  KeyRound,
  ListChecks,
  Loader2,
  ShieldAlert,
} from 'lucide-react'
import { usersApi, type MyMembership, type MyWork } from '@/lib/api'
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

const ROLE_META: Record<string, { label: string; cls: string }> = {
  admin: {
    label: 'System Administrator',
    cls: 'border-[var(--status-red-border)] bg-[var(--status-red-bg)] text-[var(--status-red-fg)]',
  },
  pmo: {
    label: 'PMO Administrator',
    cls: 'border-[var(--status-blue-border)] bg-[var(--status-blue-bg)] text-[var(--status-blue-fg)]',
  },
  executive: {
    label: 'Executive Viewer',
    cls: 'border-[var(--status-amber-border)] bg-[var(--status-amber-bg)] text-[var(--status-amber-fg)]',
  },
  user: { label: 'User', cls: 'border-transparent bg-muted text-muted-foreground' },
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

const ACCESS_META: Record<string, { label: string; cls: string }> = {
  read_only: { label: 'Read only', cls: 'bg-muted text-muted-foreground' },
  read_write: {
    label: 'Read / write',
    cls: 'bg-[var(--status-blue-bg)] text-[var(--status-blue-fg)]',
  },
  read_write_admin: {
    label: 'Read / write / admin',
    cls: 'bg-[var(--status-green-bg)] text-[var(--status-green-fg)]',
  },
}

function IdentityCard() {
  const me = useMe()
  const [name, setName] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const value = name ?? me?.full_name ?? ''
  const dirty = name !== null && name.trim() !== (me?.full_name ?? '')
  const role = ROLE_META[me?.app_role ?? 'user']

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
    <section className="stagger-in overflow-hidden rounded-lg border bg-card shadow-xs">
      {/* Brand ribbon so the page reads as "about a person", not another list */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--sidebar-primary)] via-[var(--chart-1)] to-[var(--gold)]" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <InitialsAvatar name={me?.full_name || me?.email || '…'} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-semibold">
              {me?.full_name || me?.email || '…'}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              {me?.email}
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${role.cls}`}
          >
            {role.label}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
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
              <Button
                onClick={save}
                disabled={!dirty || !value.trim() || saving}
                className="transition-transform active:scale-[0.98]"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Shown in change history, notifications, and people pickers.
            </p>
          </div>

          {me && me.capabilities.length > 0 && (
            <div>
              <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                My permissions
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {me.capabilities.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    <Check className="h-3 w-3 text-[var(--status-green-fg)]" />
                    {CAPABILITY_LABEL[c] ?? c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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
    <section
      className="stagger-in rounded-lg border bg-card p-5 shadow-xs"
      style={{ animationDelay: '60ms' }}
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <FolderKanban className="h-4 w-4 text-muted-foreground" />
        My projects
        {rows && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {rows.length}
          </span>
        )}
      </h2>
      {!rows ? (
        <Skeleton className="mt-3 h-24 w-full rounded-md" />
      ) : rows.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed px-4 py-5 text-sm text-muted-foreground">
          You are not a member of any project yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y rounded-md border">
          {rows.map((m, i) => {
            const access = ACCESS_META[m.access_level] ?? {
              label: m.access_level,
              cls: 'bg-muted text-muted-foreground',
            }
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() =>
                    m.project && navigate(`/projects/${m.project.id}`)
                  }
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {m.project?.name ?? 'Unknown project'}
                  </span>
                  {m.role?.name && (
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {m.role.name}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${access.cls}`}
                  >
                    {access.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

const WORK_ICON = {
  task: ListChecks,
  milestone: Flag,
  risk: ShieldAlert,
} as const

function WorkCard() {
  const navigate = useNavigate()
  const [work, setWork] = useState<MyWork | null>(null)

  useEffect(() => {
    usersApi
      .myWork()
      .then(setWork)
      .catch((e: Error) => toast.error(e.message))
  }, [])

  const rows = work
    ? [
        ...work.action_items.map((w) => ({
          key: `a:${w.id}`,
          kind: 'task' as const,
          text: w.title ?? '',
          meta: w.project?.name ?? '',
          due: w.due_date ?? null,
          onOpen: () =>
            navigate(`/projects/${w.project_id}/action-items/${w.id}`),
        })),
        ...work.milestones.map((w) => ({
          key: `m:${w.id}`,
          kind: 'milestone' as const,
          text: w.name ?? '',
          meta: w.project?.name ?? '',
          due: w.due_date ?? null,
          onOpen: () =>
            navigate(`/projects/${w.project_id}/milestones/${w.id}`),
        })),
        ...work.risks.map((w) => ({
          key: `r:${w.id}`,
          kind: 'risk' as const,
          text: w.statement ?? '',
          meta: w.project?.name ?? '',
          due: null,
          onOpen: () => navigate(`/projects/${w.project_id}`),
        })),
      ].sort((a, b) => (a.due ?? '9999').localeCompare(b.due ?? '9999'))
    : null

  const today = new Date().toISOString().slice(0, 10)

  return (
    <section
      className="stagger-in rounded-lg border bg-card p-5 shadow-xs"
      style={{ animationDelay: '120ms' }}
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <ListChecks className="h-4 w-4 text-muted-foreground" />
        My open work
        {rows && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {rows.length}
          </span>
        )}
      </h2>
      {!rows ? (
        <Skeleton className="mt-3 h-24 w-full rounded-md" />
      ) : rows.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed px-4 py-5 text-sm text-muted-foreground">
          Nothing assigned to you is open right now.
        </p>
      ) : (
        <ul className="mt-3 divide-y rounded-md border">
          {rows.map((r) => {
            const Icon = WORK_ICON[r.kind]
            const overdue = r.due !== null && r.due < today
            return (
              <li key={r.key}>
                <button
                  type="button"
                  onClick={r.onOpen}
                  className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      overdue
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                    aria-label={r.kind}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {r.text}
                  </span>
                  <span className="hidden max-w-36 truncate text-xs text-muted-foreground md:inline">
                    {r.meta}
                  </span>
                  {r.due && (
                    <span
                      className={`shrink-0 text-xs tabular-nums ${
                        overdue
                          ? 'font-medium text-destructive'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {dueIn(r.due)}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
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
    <section
      className="stagger-in rounded-lg border bg-card p-5 shadow-xs"
      style={{ animationDelay: '180ms' }}
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <KeyRound className="h-4 w-4 text-muted-foreground" />
        Change password
      </h2>
      <div className="mt-3 flex flex-col gap-3">
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
          <Button
            onClick={save}
            disabled={!valid || saving}
            className="transition-transform active:scale-[0.98]"
          >
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
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <IdentityCard />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <MembershipsCard />
          <PasswordCard />
        </div>
        <div className="lg:col-span-3">
          <WorkCard />
        </div>
      </div>
    </div>
  )
}
