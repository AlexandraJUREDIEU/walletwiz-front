import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  User,
  Users,
  Banknote,
  Coins,
  FileBarChart,
  Settings,
  CalendarCheck,
  Home,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import DashboardHeader from '@/layouts/DashboardHeader'
import { Button } from "@/components/ui/button";

const links = [
  { to: "/dashboard/home", label: "Accueil", icon: Home },
  { to: "/dashboard/profile", label: "Profil", icon: User },
  { to: "/dashboard/members", label: "Membres", icon: Users },
  { to: "/dashboard/banks", label: "Banques", icon: Banknote },
  { to: "/dashboard/incomes", label: "Revenus", icon: Coins },
  { to: "/dashboard/recurrings", label: "Charges fixes", icon: FileBarChart },
  { to: "/dashboard/settings", label: "Paramètres", icon: Settings },
  { to: "/dashboard/budgets", label: "Budgets", icon: CalendarCheck },
];

export default function AppLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex max-h-screen">
      <aside className="w-64 bg-white border-r flex flex-col p-4 justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold px-2 mb-4">WalletWiz</h1>
          <nav className="flex flex-col gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-muted hover:text-black"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} className="mr-2" />
          Se déconnecter
        </Button>
      </aside>

      <main className="flex-1 max-h-screen min-h-screen p-6 overflow-y-auto">
        <DashboardHeader />
        <div className="mb-6 flex-1 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
