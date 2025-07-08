import { format } from 'date-fns'
import { useAuthStore } from '@/stores/authStore'

export default function DashboardHeader() {
  const user = useAuthStore((state) => state.user)
  const mois = format(new Date(), "MMMM yyyy")

  return (
    <header className="w-full px-6 py-4 border-b bg-white flex justify-between items-center mb-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Bonjour {user?.email ?? '👤'}
        </p>
        <h1 className="text-xl font-bold">Budget de {mois}</h1>
      </div>
    </header>
  )
}