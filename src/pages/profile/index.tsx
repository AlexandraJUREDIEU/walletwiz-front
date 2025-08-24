import { useTranslation } from "react-i18next";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";

export default function ProfilePage() {
  const { t } = useTranslation();
  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader
        title={t("nav.profile")}
        description={t("pages.common.noSession")}
      />
      <EmptyState
        title={t("pages.common.emptyTitle")}
        description={t("pages.common.emptyDesc")}
      />
    </section>
  );
}