import LanguageSwitcher from "@/i18n/components/settings/LanguageSwitcher";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex">
      {/* Sidebar placeholder */}
      <aside className="flex flex-col justify-between w-56 border-r p-4">
        <h1 className="text-lg">WalletWiz</h1>
        <LanguageSwitcher />
      </aside>
      
      <main className="flex-1 p-4">
        {/* Header placeholder */}
        <header className="mb-4">Dashboard</header>
        <Outlet />
      </main>
    </div>
  );
}