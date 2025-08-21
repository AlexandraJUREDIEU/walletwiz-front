import { Home, User, Users, Banknote, Coins, FileBarChart, Settings } from "lucide-react";

export const nav = [
  { group: "Overview", items: [
    { to: "/dashboard/home", labelKey: "nav.dashboard", fallback: "Home", icon: Home },
  ]},
  { group: "Money", items: [
    { to: "/dashboard/banks",   labelKey: "nav.banks",   fallback: "Banks",   icon: Banknote },
    { to: "/dashboard/members", labelKey: "nav.members", fallback: "Members", icon: Users },
    { to: "/dashboard/incomes", labelKey: "nav.incomes", fallback: "Incomes", icon: Coins },
    { to: "/dashboard/expenses",labelKey: "nav.expenses",fallback: "Expenses",icon: Coins },
    { to: "/dashboard/budgets", labelKey: "nav.budgets", fallback: "Budgets", icon: FileBarChart },
  ]},
  { group: "Settings", items: [
    { to: "/dashboard/settings/user",    labelKey: "settings.user",    fallback: "User",    icon: User },
    { to: "/dashboard/settings/session", labelKey: "settings.session", fallback: "Session", icon: Settings },
  ]},
] as const;