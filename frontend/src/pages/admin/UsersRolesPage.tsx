import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Lock, ShieldCheck } from 'lucide-react'
import {
  accessApi,
  type AdminUser,
  type CapabilityGrants,
} from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'pmo', label: 'PMO' },
  { value: 'executive', label: 'Executive' },
  { value: 'user', label: 'User' },
]
const GRID_ROLES = ['pmo', 'executive', 'user'] as const

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[] | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    accessApi
      .users()
      .then(setUsers)
      .catch((e: Error) => toast.error(e.message))
  }, [])

  async function changeRole(user: AdminUser, role: string) {
    setBusyId(user.id)
    try {
      await accessApi.updateRole(user.id, role)
      setUsers(
        (prev) =>
          prev?.map((u) =>
            u.id === user.id
              ? { ...u, app_role: role as AdminUser['app_role'] }
              : u,
          ) ?? null,
      )
      toast.success(`${user.email ?? 'User'} is now ${role}.`)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  if (!users) return <Skeleton className="mt-4 h-48 w-full rounded-md" />

  return (
    <div className="mt-4 overflow-hidden rounded-md border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="px-4 py-2 font-medium">Person</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Global role</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-2.5 font-medium">
                {u.full_name || u.email || u.id.slice(0, 8)}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {u.email ?? '-'}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Select
                    items={ROLES}
                    value={u.app_role}
                    onValueChange={(v) => v && void changeRole(u, v)}
                    disabled={busyId === u.id}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {busyId === u.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PermissionsTab() {
  const [data, setData] = useState<CapabilityGrants | null>(null)
  const [savingRole, setSavingRole] = useState<string | null>(null)

  useEffect(() => {
    accessApi
      .capabilities()
      .then(setData)
      .catch((e: Error) => toast.error(e.message))
  }, [])

  async function toggle(role: (typeof GRID_ROLES)[number], key: string) {
    if (!data) return
    const current = data.grants[role]
    const next = current.includes(key)
      ? current.filter((c) => c !== key)
      : [...current, key]
    setSavingRole(role)
    try {
      const saved = await accessApi.saveGrants(role, next)
      setData(saved)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSavingRole(null)
    }
  }

  if (!data) return <Skeleton className="mt-4 h-64 w-full rounded-md" />

  return (
    <div className="mt-4">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />
        Admin holds every capability by design and cannot be edited here.
        Changes apply immediately and are audited.
      </p>
      <div className="mt-3 overflow-x-auto rounded-md border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Capability</th>
              <th className="px-3 py-2 text-center font-medium">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin
                </span>
              </th>
              <th className="px-3 py-2 text-center font-medium">PMO</th>
              <th className="px-3 py-2 text-center font-medium">Executive</th>
              <th className="px-3 py-2 text-center font-medium">User</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.catalog.map((cap) => (
              <tr key={cap.key}>
                <td className="px-4 py-2.5">
                  <span className="font-medium">{cap.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {cap.description}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center text-muted-foreground">
                  <input type="checkbox" checked disabled aria-label={`Admin: ${cap.label} (always granted)`} />
                </td>
                {GRID_ROLES.map((role) => (
                  <td key={role} className="px-3 py-2.5 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-[var(--primary)]"
                      checked={data.grants[role].includes(cap.key)}
                      disabled={savingRole === role}
                      onChange={() => void toggle(role, cap.key)}
                      aria-label={`${role}: ${cap.label}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * FDD role 1 ("configure ... roles"): assign global roles and edit which
 * role holds which capability. The catalog itself is code; the grants are
 * data (role_capabilities) — see FDD-ALIGNMENT section 8.
 */
export function UsersRolesPage() {
  usePageTitle('Users & Roles')
  const [tab, setTab] = useState<'users' | 'permissions'>('users')

  return (
    <div className="mx-auto max-w-4xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Administration
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Users &amp; Roles</h1>
        <Link
          to="/admin/code-tables"
          className="text-sm text-muted-foreground hover:underline"
        >
          Code Tables →
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-1 rounded-md border p-0.5 w-fit">
        {(
          [
            ['users', 'Users'],
            ['permissions', 'Permissions'],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            type="button"
            variant={tab === value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTab(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {tab === 'users' ? <UsersTab /> : <PermissionsTab />}
    </div>
  )
}
