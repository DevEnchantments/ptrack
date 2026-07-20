import { useEffect, useRef, useState } from 'react'
import { UserCheck, UserPlus } from 'lucide-react'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import { usersApi, type UserSummary } from '@/lib/api'
import { Input } from '@/components/ui/input'

interface Props {
  value: ProjectMemberInput
  onChange: (patch: Partial<ProjectMemberInput>) => void
}

export function PersonAutocomplete({ value, onChange }: Props) {
  const [results, setResults] = useState<UserSummary[]>([])
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  // Suggestions only apply while a name is typed and no user is linked yet;
  // when not searchable the list is hidden by the render guard below instead
  // of being cleared from inside the effect.
  const term = value.display_name.trim()
  const searchable = Boolean(term) && !value.user_id

  // Debounced search.
  useEffect(() => {
    if (!searchable) return
    const t = setTimeout(() => {
      usersApi
        .search(term)
        .then((r) => {
          setResults(r)
          setOpen(r.length > 0)
        })
        .catch(() => setResults([]))
    }, 250)
    return () => clearTimeout(t)
  }, [term, searchable])

  // Close the suggestion list on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function pick(u: UserSummary) {
    onChange({
      user_id: u.id,
      display_name: u.full_name || u.email || '',
      email: u.email,
    })
    setOpen(false)
    setResults([])
  }

  return (
    <div className="relative" ref={boxRef}>
      <Input
        value={value.display_name}
        placeholder="Type a name…"
        onChange={(e) =>
          // Typing clears any prior match — becomes "pending" until re-picked.
          onChange({ display_name: e.target.value, user_id: null, email: null })
        }
        onFocus={() => {
          if (results.length) setOpen(true)
        }}
      />
      {open && searchable && results.length > 0 && (
        <ul className="animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 absolute z-50 mt-1 w-full origin-top overflow-hidden rounded-md border bg-popover shadow-md duration-100">
          {results.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => pick(u)}
                className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-accent"
              >
                <span>{u.full_name || u.email}</span>
                {u.email && (
                  <span className="text-xs text-muted-foreground">{u.email}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      {value.user_id ? (
        <p className="hint-in mt-1.5 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          <UserCheck className="h-3 w-3" />
          Existing user
        </p>
      ) : value.display_name.trim() ? (
        <p className="hint-in mt-1.5 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <UserPlus className="h-3 w-3" />
          Will be added as pending
        </p>
      ) : null}
    </div>
  )
}