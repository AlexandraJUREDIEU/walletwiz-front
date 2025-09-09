import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowRight, Banknote } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import MonthPicker from "@/components/budgets/MonthPicker";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useBanks } from "@/hooks/useBanks";
import { useTransactions } from "@/hooks/useTransactions";
import { useSessionStore } from "@/stores/sessionStore";
function fmtEUR(n: number | string, lang: string) {
  const v = typeof n === "number" ? n : Number(String(n).replace(",", "."));
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(v) ? v : 0);
}
function prevMonth(current: string, delta: -1 | 1) {
  const [y, m] = current.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function fmtDateISOToLocal(iso: string, lang: string) {
  const d = iso?.length === 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
  return new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default function DashboardHome() {
  const { t, i18n } = useTranslation();
  const { currentSessionId } = useSessionStore();

  // Budget (kpis.numériques: opening, actualIn/out, endingBalance...)
  const { month, setMonth, kpis, loading: loadingBudget } = useBudgetSummary();

  // Transactions du même mois (liste -> 5 dernières)
  const {
    visible,
    loading: loadingTx,
    setMonth: setTxMonth,
    range,
  } = useTransactions({ month });
  const last5 = useMemo(() => visible.slice(0, 5), [visible]);

  // Comptes
  const { banks, loading: loadingBanks } = useBanks();
  const members = useSessionStore(
    (s) => s.membersBySession[s.currentSessionId ?? ""] ?? []
  );
  const bankMap = useMemo(
    () =>
      Object.fromEntries(
        (banks ?? []).map((b: any) => [b.id, b.label ?? b.bankName ?? b.id])
      ),
    [banks]
  );
  const memberMap = useMemo(
    () =>
      Object.fromEntries(
        (members ?? []).map((m: any) => [m.id, m.name ?? m.id])
      ),
    [members]
  );

  const hasSession = !!currentSessionId;
  const monthStr = range.from.slice(0, 7);

  // Sync MonthPicker -> hooks budget + tx
  const onPrev = () => {
    const m = prevMonth(monthStr, -1);
    setMonth(m);
    setTxMonth(m);
  };
  const onNext = () => {
    const m = prevMonth(monthStr, +1);
    setMonth(m);
    setTxMonth(m);
  };
  const onChange = (m: string) => {
    setMonth(m);
    setTxMonth(m);
  };

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-4">
      <PageHeader
        title={t("nav.dashboard")}
        description={
          hasSession
            ? t("pages.common.sessionBound", { id: currentSessionId })
            : t("pages.common.noSession")
        }
        right={
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <MonthPicker
              month={monthStr}
              onPrev={onPrev}
              onNext={onNext}
              onChange={onChange}
              disabled={!hasSession}
            />
            <Link to="/dashboard/transactions">
              <Button variant="secondary">
                <Banknote className="h-4 w-4 mr-2" />
                {t("home.actions.toTx")}
              </Button>
            </Link>
            <Link to="/dashboard/budgets">
              <Button variant="outline">{t("home.actions.toBudget")}</Button>
            </Link>
          </div>
        }
      />

      {!hasSession ? (
        <EmptyState
          title={t("home.empty.noSessionTitle")}
          description={t("home.empty.noSessionDesc")}
        />
      ) : (
        <>
          {/* KPIs */}
          {loadingBudget ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard
                label={t("home.kpi.ending")}
                value={fmtEUR(kpis?.endingBalance ?? 0, i18n.language)}
              />
              <KpiCard
                label={t("home.kpi.in")}
                value={fmtEUR(kpis?.actualIn ?? 0, i18n.language)}
                tone="pos"
                sub={t("home.kpi.sub.actual")}
              />
              <KpiCard
                label={t("home.kpi.out")}
                value={fmtEUR(kpis?.actualOut ?? 0, i18n.language)}
                tone="neg"
                sub={t("home.kpi.sub.actual")}
              />
              <KpiCard
                label={t("home.kpi.net")}
                value={fmtEUR(
                  (kpis?.actualIn ?? 0) - (kpis?.actualOut ?? 0),
                  i18n.language
                )}
                tone={
                  kpis && kpis.actualIn - kpis.actualOut >= 0 ? "pos" : "neg"
                }
              />
            </div>
          )}

          {/* Comptes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {t("home.blocks.accounts")}
              </h3>
              <Link
                to="/dashboard/banks"
                className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
              >
                {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {loadingBanks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(banks ?? []).slice(0, 6).map((b: any) => (
                  <Card key={b.id} className="hover:bg-muted/30 transition">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium">
                        {b.label ?? b.bankName ?? t("home.unknownAccount")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {b.isArchived
                          ? t("home.account.archived")
                          : t("home.account.active")}
                      </div>
                      <div className="mt-2 text-lg font-semibold">
                        {fmtEUR(
                          typeof b.initialBalance === "number"
                            ? b.initialBalance
                            : Number(b.initialBalance ?? 0),
                          i18n.language
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(banks ?? []).length === 0 && (
                  <EmptyState
                    title={t("home.accounts.emptyTitle")}
                    description={t("home.accounts.emptyDesc")}
                  >
                    <Link to="/dashboard/banks">
                      <Button size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        {t("home.accounts.add")}
                      </Button>
                    </Link>
                  </EmptyState>
                )}
              </div>
            )}
          </div>

          {/* Dernières transactions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {t("home.blocks.latestTx")}
              </h3>
              <Link
                to="/dashboard/transactions"
                className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
              >
                {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {loadingTx ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : last5.length ? (
              <div className="space-y-2">
                {last5.map((tx) => {
                  const isOut = tx.type === "OUTFLOW";
                  const amountTone = isOut
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400";
                  const bankLabel =
                    bankMap[tx.bankAccountId] ?? tx.bankAccountId;
                  const memberLabel = tx.memberId
                    ? memberMap[tx.memberId] ?? tx.memberId
                    : null;
                  const dateLabel = fmtDateISOToLocal(tx.date, i18n.language);

                  return (
                    <Card key={tx.id} className="hover:bg-muted/30 transition">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {tx.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {dateLabel}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground truncate">
                              {bankLabel}
                              {memberLabel ? ` • ${memberLabel}` : ""}
                            </div>
                          </div>
                          <div
                            className={`text-sm font-semibold whitespace-nowrap text-right ${amountTone}`}
                          >
                            {(isOut ? "-" : "+") +
                              " " +
                              fmtEUR(tx.amount, i18n.language)}
                            {(tx as any).category ? (
                              <div className="text-[11px] mt-1 px-2 py-0.5 inline-block rounded-full bg-muted text-foreground/80">
                                {(tx as any).category}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={t("home.tx.emptyTitle")}
                description={t("home.tx.emptyDesc")}
              >
                <Link to="/dashboard/transactions">
                  <Button size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-1" />
                    {t("home.tx.add")}
                  </Button>
                </Link>
              </EmptyState>
            )}
          </div>
        </>
      )}
    </section>
  );
}
