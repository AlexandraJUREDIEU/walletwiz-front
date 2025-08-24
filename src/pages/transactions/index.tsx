import { useTranslation } from "react-i18next";
import { useSessionStore } from "@/stores/sessionStore";

export default function TransactionsPage() {
  const { t } = useTranslation();
  const { currentSessionId } = useSessionStore();
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">{t("nav.transactions")}</h1>
      <p className="text-sm text-muted-foreground">
        {currentSessionId
          ? t("pages.common.sessionBound", { id: currentSessionId })
          : t("pages.common.noSession")}
      </p>
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        {t("pages.common.empty")}
      </div>
    </section>
  );
}