import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  /** Singular record noun, e.g. "milestone". */
  noun: string
  /** Irregular plural, e.g. "people"; defaults to noun + "s". */
  plural?: string
  count: number
  onConfirm: () => void
}

/** FR-13 download confirmation, shared by every register's CSV export. */
export function ExportCsvDialog({
  open,
  onOpenChange,
  noun,
  plural,
  count,
  onConfirm,
}: Props) {
  const many = plural ?? `${noun}s`
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download {many}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You are about to download {count}{' '}
          {count === 1 ? `${noun} record` : `${many.replace(/s$/, '')} records`} (the currently
          filtered list) as a CSV file readable by Excel.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
