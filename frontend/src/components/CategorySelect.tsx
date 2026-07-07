import { useEffect, useState } from 'react'
import { lookupsApi, categoriesApi, type Lookup } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const NEW_CATEGORY = '__new__'

interface Props {
  value: string | null
  onChange: (categoryId: string | null) => void
}

export function CategorySelect({ value, onChange }: Props) {
  const [categories, setCategories] = useState<Lookup[]>([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    lookupsApi
      .list('project-categories')
      .then(setCategories)
      .catch(() => {})
  }, [])

  async function saveNew() {
    const name = newName.trim()
    if (!name) return
    setError(null)
    try {
      const created = await categoriesApi.create(name)
      setCategories((c) => [...c, created])
      onChange(created.id)
      setCreating(false)
      setNewName('')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  if (creating) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            autoFocus
            value={newName}
            placeholder="New category name"
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void saveNew()
              }
            }}
          />
          <Button type="button" onClick={() => void saveNew()}>
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCreating(false)
              setNewName('')
              setError(null)
            }}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <Select
      items={[
        ...categories.map((c) => ({ label: c.name, value: c.id })),
        { label: '＋ New category…', value: NEW_CATEGORY },
      ]}
      value={value ?? undefined}
      onValueChange={(v) => {
        if (v === NEW_CATEGORY) {
          setCreating(true)
          return
        }
        onChange(v)
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="- Select Category -" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
        <SelectItem value={NEW_CATEGORY}>＋ New category…</SelectItem>
      </SelectContent>
    </Select>
  )
}