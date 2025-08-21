import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/layouts/Sidebar";
import { MobileSidebar } from "@/layouts/MobileSidebar";
import { SidebarTrigger } from "@/layouts/SidebarTrigger";
import LanguageSwitcher from "@/i18n/components/settings/LanguageSwitcher";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";

export default function AppLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-dvh grid md:grid-cols-[240px_1fr] overflow-x-hidden">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Colonne content */}
      <div className="flex min-h-dvh flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-3 md:px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger onClick={() => setMobileOpen(true)} />
              <div className="text-sm text-muted-foreground md:hidden">WalletWiz</div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="text-sm px-3 py-2 rounded-md border hover:bg-muted"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>

      {/* Drawer mobile */}
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
    </div>
  );
}