import { useState } from 'react'
import { Copy, Loader2, Mail, RefreshCw, Wand2 } from 'lucide-react'
import { usersApi } from '@/lib/api'
import {
  EMAIL_RE,
  inviteDraft,
  pocEmail,
  tempPassword,
} from '@/lib/provision'
import { toast } from '@/lib/toast'
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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The pending person being converted. */
  person: { name: string; email: string | null }
  projectName?: string | null
  onProvisioned: () => void
}

/** Turns a pending person into a real account (Supabase Admin API via the
 *  backend), then drafts an invitation to send from YOUR mailbox (mailto) —
 *  no SMTP involved. The compose box is where AI generate/refine lands once
 *  an LLM key is configured. */
export function CreateAccountDialog({
  open,
  onOpenChange,
  person,
  projectName,
  onProvisioned,
}: Props) {
  const [step, setStep] = useState<'form' | 'invite'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [claimed, setClaimed] = useState(0)

  // Reset + prefill on open (render-phase prev-key pattern).
  const populateKey = open ? `${person.name}|${person.email ?? ''}` : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      setStep('form')
      setName(person.name)
      setEmail(person.email ?? '')
      setPassword(tempPassword())
      setMessage('')
      setError(null)
      setClaimed(0)
    }
  }

  async function create() {
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanName) return setError('A full name is required.')
    if (!EMAIL_RE.test(cleanEmail))
      return setError('Enter a valid email (or generate a PoC one).')
    setCreating(true)
    setError(null)
    try {
      const result = await usersApi.provision({
        email: cleanEmail,
        full_name: cleanName,
        password,
      })
      setClaimed(result.claimed)
      setMessage(
        inviteDraft({
          name: cleanName,
          email: cleanEmail,
          password,
          projectName,
        }),
      )
      setStep('invite')
      toast.success(
        `Account created; ${result.claimed} pending membership${result.claimed === 1 ? '' : 's'} linked.`,
      )
      onProvisioned()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setCreating(false)
    }
  }

  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${what} copied.`)
    } catch {
      toast.error('Could not copy — select and copy manually.')
    }
  }

  const mailtoHref = `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(
    projectName
      ? `You've been added to ${projectName} on P-Track`
      : "You've been added to P-Track",
  )}&body=${encodeURIComponent(message)}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 'form' ? 'Create Account' : 'Invitation'}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Creates a real login for this person and links every pending
              membership with the same email.
            </p>
            <div className="flex flex-col gap-2">
              <Label>
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="person@example.com"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  title="Generate a unique fake email — for proof-of-concept accounts, since emails must be unique"
                  onClick={() => setEmail(pocEmail(name || person.name))}
                >
                  <Wand2 className="h-4 w-4" />
                  PoC email
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                PoC emails use a fake domain that can never receive real mail.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Temporary Password</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={password} className="font-mono" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label="Regenerate password"
                  onClick={() => setPassword(tempPassword())}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label="Copy password"
                  onClick={() => void copy(password, 'Password')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Shown once — copy it or use the invitation on the next step.
              </p>
            </div>
            {error && (
              <p className="hint-in text-sm font-medium text-destructive">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Account ready ({claimed} membership
              {claimed === 1 ? '' : 's'} linked). Edit the invitation below,
              then send it from your own mailbox.
            </p>
            <Textarea
              rows={12}
              className="font-mono text-xs"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  window.location.href = mailtoHref
                }}
              >
                <Mail />
                Open in email app
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void copy(message, 'Invitation')}
              >
                <Copy />
                Copy message
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              AI-drafted and AI-refined invitations arrive here once an LLM
              key is configured; in-app sending arrives with SMTP.
            </p>
          </div>
        )}

        <DialogFooter>
          {step === 'form' ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button onClick={create} disabled={creating}>
                {creating && <Loader2 className="animate-spin" />}
                {creating ? 'Creating…' : 'Create Account'}
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
