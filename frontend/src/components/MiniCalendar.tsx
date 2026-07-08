const WEEKDAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function dateParts(s: string): { y: number; m: number; d: number } {
  if (s.length <= 10) {
    const [y, m, d] = s.split('-').map(Number)
    return { y, m, d }
  }
  const dt = new Date(s)
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() }
}

interface Props {
  label: string
  date: string | null
}

export function MiniCalendar({ label, date }: Props) {
  if (!date) return null
  const { y, m, d } = dateParts(date)
  if (!y || !m || !d) return null

  const firstWeekday = new Date(y, m - 1, 1).getDay()
  const daysInMonth = new Date(y, m, 0).getDate()

  // Build a flat list of cells: leading blanks + day numbers.
  const cells: (number | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="rounded-md border p-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mb-2 text-center text-sm font-medium">
        {MONTHS[m - 1]} {y}
      </p>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px]">
        {WEEKDAY_HEADERS.map((w) => (
          <div key={w} className="text-muted-foreground">
            {w}
          </div>
        ))}
        {cells.map((cell, i) => (
          <div key={i} className="flex items-center justify-center">
            {cell === null ? (
              <span />
            ) : cell === d ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {cell}
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center">
                {cell}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}