import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  // * State management
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex max-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
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
