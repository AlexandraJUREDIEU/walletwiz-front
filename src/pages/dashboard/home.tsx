import { useTranslation } from "react-i18next";

export default function DashboardHome() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{t("nav.dashboard")}</h2>
      <p className="text-sm text-muted-foreground">{t("app.welcome")}</p>
    </div>
  );
}