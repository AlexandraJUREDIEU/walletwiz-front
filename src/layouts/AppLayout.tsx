import { NavLink, Outlet } from 'react-router-dom'
import {
  User,
  Users,
  Banknote,
  Coins,
  FileBarChart,
  Settings,
  CalendarCheck,
  Home,
} from 'lucide-react'

const links = [
  { to: '/dashboard/home', label: 'Accueil', icon: Home },
  { to: '/dashboard/profile', label: 'Profil', icon: User },
  { to: '/dashboard/members', label: 'Membres', icon: Users },
  { to: '/dashboard/banks', label: 'Banques', icon: Banknote },
  { to: '/dashboard/incomes', label: 'Revenus', icon: Coins },
  { to: '/dashboard/recurrings', label: 'Charges fixes', icon: FileBarChart },
  { to: '/dashboard/settings', label: 'Paramètres', icon: Settings },
  { to: '/dashboard/budgets', label: 'Budgets', icon: CalendarCheck },
]

export default function AppLayout() {
  return (
   <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold px-2">WalletWiz</h1>
        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-muted hover:text-black'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}