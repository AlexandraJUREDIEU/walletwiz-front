import { NavLink } from "react-router-dom";
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
  X,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/specifics/Logo";

const links = [
  { to: "/dashboard/home", label: "Accueil", icon: Home },
  { to: "/dashboard/profile", label: "Profil", icon: User },
  { to: "/dashboard/members", label: "Membres", icon: Users },
  { to: "/dashboard/banks", label: "Banques", icon: Banknote },
  { to: "/dashboard/incomes", label: "Revenus", icon: Coins },
  { to: "/dashboard/expenses", label: "Charges fixes", icon: FileBarChart },
  { to: "/dashboard/settings", label: "Paramètres", icon: Settings },
  { to: "/dashboard/budgets", label: "Budgets", icon: CalendarCheck },
];



export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside
      className={cn(
        " fixed inset-y-0 left-0 z-40 w-64 bg-white border-r p-4 flex flex-col justify-between duration-300 ease-in-out transition-transform lg:static lg:translate-x-0 lg:flex",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <Logo variant="small" />
          <h1 className="text-xl font-bold">WalletWiz</h1>
        </div>
          {/* Bouton de fermeture pour mobile */}
          <button className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
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
        onClick={logout}
        variant="ghost"
        className="w-full justify-start text-red-600 hover:bg-red-50"
      >
        <LogOut size={16} className="mr-2" />
        Se déconnecter
      </Button>
    </aside>
  );
}
