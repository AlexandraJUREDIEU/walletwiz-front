import { useTranslation } from "react-i18next";
import { useSessionStore } from "@/stores/sessionStore";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";

export default function DashboardHome() {
  const { t } = useTranslation();
  const { currentSessionId } = useSessionStore();

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader
        title={t("nav.home")}
        description={
          currentSessionId
            ? t("pages.common.sessionBound", { id: currentSessionId })
            : t("pages.common.noSession")
        }
      />
      <EmptyState
        title={t("pages.common.emptyTitle")}
        description={t("pages.common.emptyDesc")}
      />
    </section>
  );
}
