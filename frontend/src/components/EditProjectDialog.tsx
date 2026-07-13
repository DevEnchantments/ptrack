import { useEffect, useState } from 'react'
import {
  projectsApi,
  lookupsApi,
  categoriesApi,
  type ProjectDetail,
  type Project,
  type Lookup,
} from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const NONE = '__none__'
const NEW_CATEGORY = '__new_category__'

interface Props {
  project: ProjectDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
  onDeleted: () => void
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSaved,
  onDeleted,
}: Props) {
  const [statuses, setStatuses] = useState<Lookup[]>([])
  const [sizes, setSizes] = useState<Lookup[]>([])
  const [categories, setCategories] = useState<Lookup[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)
  const [statusId, setStatusId] = useState<string | null>(null)
  const [sizeId, setSizeId] = useState<string | null>(null)
  const [accessControl, setAccessControl] = useState('open')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [tags, setTags] = useState('')
  const [customer, setCustomer] = useState('')
  const [primaryUrl, setPrimaryUrl] = useState('')
  const [startDate, setStartDate] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!open) return
    lookupsApi.list('project-statuses').then(setStatuses).catch(() => {})
    lookupsApi.list('project-sizes').then(setSizes).catch(() => {})
    lookupsApi.list('project-categories').then(setCategories).catch(() => {})
    projectsApi.list().then(setProjects).catch(() => {})
  }, [open])

  useEffect(() => {
    if (!open) return
    setName(project.name)
    setParentId(project.parent_project_id)
    setStatusId(project.status_id)
    setSizeId(project.size_id)
    setAccessControl(project.access_control || 'open')
    setCategoryId(project.category_id)
    setNewCategory('')
    setDescription(project.description ?? '')
    setGoal(project.goal ?? '')
    setTags(project.tags?.join(', ') ?? '')
    setCustomer(project.customer ?? '')
    setPrimaryUrl(project.primary_url ?? '')
    setStartDate(project.start_date ?? '')
    setError(null)
    setConfirmDelete(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project])

  async function submit() {
    setError(null)
    if (!name.trim()) return setError('A project name is required.')
    if (!statusId) return setError('A status is required.')

    setSaving(true)
    try {
      let finalCategoryId = categoryId
      if (categoryId === NEW_CATEGORY) {
        if (!newCategory.trim()) {
          setSaving(false)
          return setError('Enter a name for the new category.')
        }
        const created = await categoriesApi.create(newCategory.trim())
        finalCategoryId = created.id
      }

      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      await projectsApi.update(project.id, {
        name: name.trim(),
        parent_project_id: parentId,
        status_id: statusId,
        size_id: sizeId,
        category_id: finalCategoryId,
        access_control: accessControl,
        description: description.trim() || null,
        goal: goal.trim() || null,
        customer: customer.trim() || null,
        primary_url: primaryUrl.trim() || null,
        tags: tagList.length ? tagList : null,
        start_date: startDate || null,
      })
      onOpenChange(false)
      onSaved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function doDelete() {
    setError(null)
    setDeleting(true)
    try {
      await projectsApi.remove(project.id)
      onOpenChange(false)
      onDeleted()
    } catch (e) {
      setError((e as Error).message)
      setConfirmDelete(false)
    } finally {
      setDeleting(false)
    }
  }

  const busy = saving || deleting
  const parentOptions = projects.filter((p) => p.id !== project.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Parent Project</Label>
            <Select
              items={[
                { label: '- None -', value: NONE },
                ...parentOptions.map((p) => ({ label: p.name, value: p.id })),
              ]}
              value={parentId ?? NONE}
              onValueChange={(v) => setParentId(v === NONE ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="- None -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>- None -</SelectItem>
                {parentOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                items={statuses.map((s) => ({ label: s.name, value: s.id }))}
                value={statusId ?? ''}
                onValueChange={(v) => setStatusId(v ?? null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Project Size</Label>
              <Select
                items={sizes.map((s) => ({ label: s.name, value: s.id }))}
                value={sizeId ?? ''}
                onValueChange={(v) => setSizeId(v ?? null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Access Control <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="access-control"
                  className="h-4 w-4 accent-primary"
                  checked={accessControl === 'open'}
                  onChange={() => setAccessControl('open')}
                />
                <span className="text-sm">Open</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="access-control"
                  className="h-4 w-4 accent-primary"
                  checked={accessControl === 'restricted'}
                  onChange={() => setAccessControl('restricted')}
                />
                <span className="text-sm font-medium">
                  Restricted – Only Accessible by Associated People
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select
              items={[
                ...categories.map((c) => ({ label: c.name, value: c.id })),
                { label: '- New Category -', value: NEW_CATEGORY },
              ]}
              value={categoryId ?? ''}
              onValueChange={(v) => setCategoryId(v ?? null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="- Select -" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
                <SelectItem value={NEW_CATEGORY}>- New Category -</SelectItem>
              </SelectContent>
            </Select>
            {categoryId === NEW_CATEGORY && (
              <Input
                value={newCategory}
                placeholder="New Category Name"
                onChange={(e) => setNewCategory(e.target.value)}
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Goal</Label>
            <Textarea
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <Input
              value={tags}
              placeholder="Enter tags separated by commas"
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Customer</Label>
              <Input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Primary URL</Label>
              <Input
                value={primaryUrl}
                onChange={(e) => setPrimaryUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:w-1/2">
            <Label>Project Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-destructive">
                  Delete this project?
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={doDelete}
                  disabled={busy}
                >
                  {deleting ? 'Deleting…' : 'Confirm'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => setConfirmDelete(true)}
                disabled={busy}
              >
                Delete
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={submit} disabled={busy}>
              {saving ? 'Saving…' : 'Apply Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}