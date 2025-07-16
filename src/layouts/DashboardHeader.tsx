import { useProfileStore } from '@/stores/profileStore'
import { useAuthStore } from '@/stores/authStore'
import { getMonthKey, getMonthLabel } from '@/lib/dateUtils'

export default function DashboardHeader() {
  const currentMonthKey = getMonthKey();
  const user = useAuthStore((state) => state.user)
  const profile = useProfileStore((state) => state.profile)
  

  // Détermination du nom à afficher
  const displayName =
    profile?.name?.trim() ||
    user?.email ||
    '👤'

  return (
    <header className="w-full px-6 py-4 border-b bg-white flex justify-between items-center mb-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Bonjour {displayName}
        </p>
        <h1 className="text-xl font-bold">Budget de {getMonthLabel(currentMonthKey)}</h1>
      </div>
    </header>
  )
}