import { useTranslation } from "react-i18next";
import { useSessionStore } from "@/stores/sessionStore";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { getCurrentMonthRange } from "@/lib/utils/date";
import { useMemo } from "react";
import { RecentTransactionsPlaceholder } from "@/components/home/RecentTransactions";
import { TxClearedPendingPlaceholder } from "@/components/home/TxClearedPending";
import { AccountsMiniListPlaceholder } from "@/components/home/AccountMiniList";
import { KpiSkeleton } from "@/components/home/skeletons";
import { KpiCard } from "@/components/home/KpiCard";

export default function DashboardHome() {
  const { from, to } = useMemo(() => getCurrentMonthRange(), []);
  const { t } = useTranslation();
  const { currentSessionId } = useSessionStore();
  const isLoading = false;
  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
            
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Période : {from} → {to}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard title="Revenus planifiés" value="—" hint="Mois courant" tone="good" />
            <KpiCard title="Dépenses fixes" value="—" hint="Mois courant" tone="bad" />
            <KpiCard title="Dépensé ce mois" value="—" hint="Transactions OUT" tone="bad" />
            <KpiCard title="Balance restante" value="—" hint="Projection fin de mois" tone="neutral" />
          </>
        )}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactionsPlaceholder />
        </div>
        <div className="space-y-4">
          <TxClearedPendingPlaceholder />
          <AccountsMiniListPlaceholder />
        </div>
      </div>
    </section>
  );
}
