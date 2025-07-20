import { useProfileStore } from '@/stores/profileStore'
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore'
import { getMonthKey, getMonthLabel } from '@/lib/dateUtils'
import { Menu } from 'lucide-react';

export default function DashboardHeader() {
  // ** Hooks
  const currentMonthKey = getMonthKey();

  // ** Stores
  const user = useAuthStore((state) => state.user)
  const profile = useProfileStore((state) => state.profile)
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  
  // ** Handlers
  // Détermination du nom à afficher
  const displayName =
    profile?.firstName?.trim() ||
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
      <div>
        {/* Bouton burger visible uniquement en mobile */}
      <button
        onClick={toggleSidebar}
        className="block lg:hidden p-2 rounded-md hover:bg-muted"
      >
        <Menu size={20} />
      </button>
      </div>
    </header>
  )
}