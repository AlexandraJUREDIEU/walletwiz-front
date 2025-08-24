import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">{t("nav.profile")}</h1>
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        {t("pages.common.empty")}
      </div>
    </section>
  );
}