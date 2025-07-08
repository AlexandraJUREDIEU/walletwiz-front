import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/dashboard/home', label: 'Accueil' },
  { to: '/dashboard/profile', label: 'Profil' },
  { to: '/dashboard/members', label: 'Membres' },
  { to: '/dashboard/banks', label: 'Banques' },
  { to: '/dashboard/incomes', label: 'Revenus' },
  { to: '/dashboard/recurrings', label: 'Charges fixes' },
  { to: '/dashboard/settings', label: 'Paramètres' },
  { to: '/dashboard/budgets', label: 'Budgets' },
]

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h1 className="text-xl font-bold mb-6">WalletWiz</h1>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              {link.label}
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