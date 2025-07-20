import { useSidebarStore } from "@/stores/sidebarStore";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function AppLayout() {
  const { isOpen, close } = useSidebarStore();

  useEffect(() => {
  window.scrollTo(0, 0);
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, [isOpen]);

  return (
    <div className="flex max-h-screen">
      <Sidebar isOpen={isOpen} onClose={close} />
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={close}
        />
      )}
      <main className="flex-1 max-h-screen min-h-screen p-6 overflow-y-auto">
        <DashboardHeader />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

