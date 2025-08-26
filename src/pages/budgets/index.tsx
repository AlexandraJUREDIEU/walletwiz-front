import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MonthPicker from "@/components/budgets/MonthPicker";
import KpiCard from "@/components/budgets/KpiCard";
import EditOpeningDialog from "@/components/budgets/EditOpeningDialog";
import EditNotesDialog from "@/components/budgets/EditNotesDialog";
import { Lock, Unlock, Pencil } from "lucide-react";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useSessionStore } from "@/stores/sessionStore";
import { useBudgetsService } from "@/lib/service/budget.service";
import type { Budget } from "@/types";
import { toast } from "sonner";

function fmtEUR(v: number, lang: string) {
  return new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(v);
}

export default function BudgetsPage() {
  const { t, i18n } = useTranslation();
  const { currentSessionId } = useSessionStore();
  const hasSession = !!currentSessionId;

  const { month, setMonth, goPrevMonth, goNextMonth, summary, kpis, loading, lock, unlock, updateOpening, updateNotes } =
    useBudgetSummary();

  // Récupérer meta budget (lock state) — car non présent dans BudgetSummary
  const { getByMonth } = useBudgetsService();
  const [budgetMeta, setBudgetMeta] = useState<Budget | null>(null);
  async function reloadMeta() {
    if (!currentSessionId) return setBudgetMeta(null);
    try {
      const b = await getByMonth(currentSessionId, month);
      setBudgetMeta(b);
    } catch {
      setBudgetMeta(null);
    }
  }
  useEffect(() => { void reloadMeta(); /* au mount/chgt de mois/session */ }, [currentSessionId, month]);

  // Dialogs
  const [openOpening, setOpenOpening] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);

  const locked = !!budgetMeta?.locked;

  async function onToggleLock() {
    try {
      if (locked) { await unlock(); toast.success(t("budgets.toasts.unlocked")); }
      else { await lock(); toast.success(t("budgets.toasts.locked")); }
    } finally {
      await reloadMeta();
    }
  }

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-4">
      <PageHeader
        title={t("nav.budgets")}
        description={
          hasSession
            ? t("pages.common.sessionBound", { id: currentSessionId })
            : t("pages.common.noSession")
        }
        right={
          <div className="flex flex-wrap gap-2">
            <MonthPicker
              month={month}
              onPrev={goPrevMonth}
              onNext={goNextMonth}
              onChange={(m) => setMonth(m)}
              disabled={!hasSession}
            />
            <Button variant={locked ? "secondary" : "outline"} onClick={onToggleLock} disabled={!hasSession}>
              {locked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
              {locked ? t("budgets.actions.unlock") : t("budgets.actions.lock")}
            </Button>
            <Button variant="outline" onClick={() => setOpenOpening(true)} disabled={!hasSession || locked}>
              <Pencil className="h-4 w-4 mr-2" />
              {t("budgets.actions.editOpening")}
            </Button>
            <Button variant="outline" onClick={() => setOpenNotes(true)} disabled={!hasSession || locked}>
              <Pencil className="h-4 w-4 mr-2" />
              {t("budgets.actions.editNotes")}
            </Button>
          </div>
        }
      />

      {!hasSession ? (
        <EmptyState title={t("budgets.empty.noSessionTitle")} description={t("budgets.empty.noSessionDesc")} />
      ) : loading && !summary ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><div className="h-4 w-24 bg-muted rounded" /><div className="h-6 w-32 bg-muted rounded mt-2" /></CardContent></Card>
          ))}
        </div>
      ) : !summary || !kpis ? (
        <EmptyState title={t("budgets.empty.title")} description={t("budgets.empty.desc")} />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label={t("budgets.kpi.opening")} value={fmtEUR(kpis.opening, i18n.language)} />
            <KpiCard label={t("budgets.kpi.plannedIn")} value={fmtEUR(kpis.plannedIn, i18n.language)} tone="good" />
            <KpiCard label={t("budgets.kpi.plannedOut")} value={fmtEUR(kpis.plannedOut, i18n.language)} tone="bad" />
            <KpiCard label={t("budgets.kpi.netPlanned")} value={fmtEUR(kpis.netPlanned, i18n.language)} tone={kpis.netPlanned >= 0 ? "good" : "bad"} hint={t("budgets.hints.netPlanned")} />

            <KpiCard label={t("budgets.kpi.projectedEnd")} value={fmtEUR(kpis.projectedEndBalance, i18n.language)} />
            <KpiCard label={t("budgets.kpi.actualIn")} value={fmtEUR(kpis.actualIn, i18n.language)} tone="good" />
            <KpiCard label={t("budgets.kpi.actualOut")} value={fmtEUR(kpis.actualOut, i18n.language)} tone="bad" />
            <KpiCard label={t("budgets.kpi.netActual")} value={fmtEUR(kpis.netActual, i18n.language)} tone={kpis.netActual >= 0 ? "good" : "bad"} />

            <KpiCard label={t("budgets.kpi.ending")} value={fmtEUR(kpis.endingBalance, i18n.language)} />
            <KpiCard label={t("budgets.kpi.clearedIn")} value={fmtEUR(kpis.clearedIn, i18n.language)} tone="good" />
            <KpiCard label={t("budgets.kpi.clearedOut")} value={fmtEUR(kpis.clearedOut, i18n.language)} tone="bad" />
            <KpiCard label={t("budgets.kpi.netCleared")} value={fmtEUR(kpis.netCleared, i18n.language)} tone={kpis.netCleared >= 0 ? "good" : "bad"} />
          </div>

          {/* Notes */}
          <Card className="mt-2">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("budgets.notes.titleShort")}</div>
              <div className="mt-1 text-sm text-foreground whitespace-pre-wrap min-h-[1.5rem]">
                {budgetMeta?.notes ?? t("budgets.notes.empty")}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Dialogs */}
      {summary && (
        <>
          <EditOpeningDialog
            open={openOpening}
            onOpenChange={setOpenOpening}
            initial={summary.openingBalance}
            onSave={async (n) => { await updateOpening(n); await reloadMeta(); }}
            disabled={locked}
          />
          <EditNotesDialog
            open={openNotes}
            onOpenChange={setOpenNotes}
            initial={(summary as any).notes ?? null}
            onSave={async (txt) => { await updateNotes(txt); await reloadMeta(); }}
            disabled={locked}
          />
        </>
      )}
    </section>
  );
}
