import { useTranslation } from "react-i18next";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { useBanks } from "@/hooks/useBanks";

export default function BanksPage() {
  const { t } = useTranslation();


  const { banks, loading, currentSessionId } = useBanks();
  console.log("Banks loading:", loading, "session:", currentSessionId, banks);

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader
        title={t("nav.banks")}
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