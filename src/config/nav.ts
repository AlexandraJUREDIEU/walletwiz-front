import type { LucideIcon } from "lucide-react";
import {
  Home,
  Banknote,
  Users,
  Coins,
  FileBarChart,
  CalendarCheck,
  CreditCard,
  User as UserIcon,
  Settings as SettingsIcon,
} from "lucide-react";

type NavItem = {
  to: string;
  labelKey: string;
  fallback: string; // utilisé par NavList: t(labelKey, fallback)
  icon: LucideIcon;
};

type NavSection = {
  group: string;     // affiché tel quel par NavList
  items: NavItem[];
};

// Deux sections: principale & paramètres (tu peux renommer les group labels)
export const nav: NavSection[] = [
  {
    group: "Dashboard",
    items: [
      { to: "/dashboard/home",         labelKey: "nav.home",         fallback: "Home",         icon: Home },
      { to: "/dashboard/banks",        labelKey: "nav.banks",        fallback: "Banks",        icon: Banknote },
      { to: "/dashboard/members",      labelKey: "nav.members",      fallback: "Members",      icon: Users },
      { to: "/dashboard/incomes",      labelKey: "nav.incomes",      fallback: "Incomes",      icon: Coins },
      { to: "/dashboard/expenses",     labelKey: "nav.expenses",     fallback: "Fixed exp.",   icon: FileBarChart },
      { to: "/dashboard/budgets",      labelKey: "nav.budgets",      fallback: "Budgets",      icon: CalendarCheck },
      { to: "/dashboard/transactions", labelKey: "nav.transactions", fallback: "Transactions", icon: CreditCard },
    ],
  },
  {
    group: "Paramètres",
    items: [
      { to: "/dashboard/settings/profile", labelKey: "nav.profile",  fallback: "Profile",  icon: UserIcon },
      { to: "/dashboard/settings/session", labelKey: "nav.sessions", fallback: "Sessions", icon: SettingsIcon },
    ],
  },
];