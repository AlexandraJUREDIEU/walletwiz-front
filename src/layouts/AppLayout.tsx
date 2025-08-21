import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex">
      {/* Sidebar placeholder */}
      <aside className="w-56 border-r p-4">WalletWiz</aside>
      <main className="flex-1 p-4">
        {/* Header placeholder */}
        <header className="mb-4">Dashboard</header>
        <Outlet />
      </main>
    </div>
  );
}