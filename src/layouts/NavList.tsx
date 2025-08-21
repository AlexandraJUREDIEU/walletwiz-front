import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { nav } from "@/config/nav";

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();
  return (
    <nav className="px-2 py-2 space-y-4">
      {nav.map((section) => (
        <div key={section.group} className="space-y-1">
          <div className="px-3 text-[11px] uppercase tracking-wide text-muted-foreground/80">
            {section.group}
          </div>
          {section.items.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span>{t(l.labelKey, l.fallback)}</span>
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}