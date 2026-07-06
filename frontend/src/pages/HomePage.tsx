import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

export function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-svh">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-lg font-semibold">P-Track</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </header>
      <main className="p-6">
        <p className="text-muted-foreground">
          You're signed in. Project features will appear here.
        </p>
      </main>
    </div>
  )
}