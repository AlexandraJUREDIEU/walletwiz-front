import { NavList } from "./NavList";

export function Sidebar() {
  return (
    <aside
      className="hidden md:flex md:flex-col md:w-60 border-r bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Primary"
    >
      <div className="px-4 py-3 text-xl font-semibold h-display">WalletWiz</div>
      <NavList />
    </aside>
  );
}