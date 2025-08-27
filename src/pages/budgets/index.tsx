import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MonthPicker from "@/components/budgets/MonthPicker";
import EditOpeningDialog from "@/components/budgets/EditOpeningDialog";
import EditNotesDialog from "@/components/budgets/EditNotesDialog";
import { Lock, Unlock, Pencil } from "lucide-react";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useSessionStore } from "@/stores/sessionStore";
import { useBudgetsService } from "@/lib/service/budget.service";
import type { Budget } from "@/types";
import { toast } from "sonner";
import CompareTile from "@/components/budgets/CompareTile";
import HeroSummary from "@/components/budgets/HeroSummary";
import ModeTabs from "@/components/budgets/ModeTabs";

function fmtEUR(v: number, lang: string) {
  return new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(v);
}

export default function BudgetsPage() {
  const [mode, setMode] = useState<"planned" | "actual" | "cleared">("planned");
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
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <MonthPicker
            month={month}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            onChange={(m) => setMonth(m)}
            disabled={!hasSession}
          />
          <ModeTabs
            value={(mode as any) ?? "planned"}
            onChange={(m) => setMode(m)}
            disabled={!hasSession}
          />
          <div className="flex gap-2">
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
        </div>
      }
    />

    {!hasSession ? (
      <EmptyState title={t("budgets.empty.noSessionTitle")} description={t("budgets.empty.noSessionDesc")} />
    ) : loading && !summary ? (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-8 w-40 bg-muted rounded mt-2" />
              <div className="h-10 w-full bg-muted rounded mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    ) : !summary || !kpis ? (
      <EmptyState title={t("budgets.empty.title")} description={t("budgets.empty.desc")} />
    ) : (
      <>
        {/* HERO */}
        <HeroSummary
          title={
            mode === "planned"
              ? t("budgets.hero.projected")
              : mode === "actual"
              ? t("budgets.hero.ending")
              : t("budgets.hero.clearedEnding")
          }
          main={
            mode === "planned"
              ? fmtEUR(kpis.projectedEndBalance, i18n.language)
              : mode === "actual"
              ? fmtEUR(kpis.endingBalance, i18n.language)
              : fmtEUR(kpis.clearedEndingBalance, i18n.language)
          }
          tone={
            (mode === "planned" ? kpis.netPlanned : mode === "actual" ? kpis.netActual : kpis.netCleared) >= 0
              ? "good"
              : "bad"
          }
          rows={
            mode === "planned"
              ? [
                  { label: t("budgets.rows.opening"), value: fmtEUR(kpis.opening, i18n.language) },
                  { label: t("budgets.rows.in"), value: fmtEUR(kpis.plannedIn, i18n.language), tone: "good" },
                  { label: t("budgets.rows.out"), value: fmtEUR(kpis.plannedOut, i18n.language), tone: "bad" },
                  { label: t("budgets.rows.net"), value: fmtEUR(kpis.netPlanned, i18n.language), tone: kpis.netPlanned >= 0 ? "good" : "bad" },
                ]
              : mode === "actual"
              ? [
                  { label: t("budgets.rows.opening"), value: fmtEUR(kpis.opening, i18n.language) },
                  { label: t("budgets.rows.in"), value: fmtEUR(kpis.actualIn, i18n.language), tone: "good" },
                  { label: t("budgets.rows.out"), value: fmtEUR(kpis.actualOut, i18n.language), tone: "bad" },
                  { label: t("budgets.rows.net"), value: fmtEUR(kpis.netActual, i18n.language), tone: kpis.netActual >= 0 ? "good" : "bad" },
                ]
              : [
                  { label: t("budgets.rows.in"), value: fmtEUR(kpis.clearedIn, i18n.language), tone: "good" },
                  { label: t("budgets.rows.out"), value: fmtEUR(kpis.clearedOut, i18n.language), tone: "bad" },
                  { label: t("budgets.rows.net"), value: fmtEUR(kpis.netCleared, i18n.language), tone: kpis.netCleared >= 0 ? "good" : "bad" },
                  { label: t("budgets.rows.base"), value: fmtEUR(kpis.endingBalance, i18n.language) },
                ]
          }
        />

        {/* COMPARAISONS */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <CompareTile
            title={t("budgets.compare.inflow")}
            leftLabel="Planned"
            leftValue={fmtEUR(kpis.plannedIn, i18n.language)}
            rightLabel="Actual"
            rightValue={fmtEUR(kpis.actualIn, i18n.language)}
          />
          <CompareTile
            title={t("budgets.compare.outflow")}
            leftLabel="Planned"
            leftValue={fmtEUR(kpis.plannedOut, i18n.language)}
            rightLabel="Actual"
            rightValue={fmtEUR(kpis.actualOut, i18n.language)}
          />
        </div>

        {/* NOTES */}
        <Card>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("budgets.notes.titleShort")}</div>
            <div className="mt-1 text-sm text-foreground whitespace-pre-wrap min-h-[1.5rem]">
              {summary?.budget?.notes ?? t("budgets.notes.empty")}
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
          initial={budgetMeta?.notes ?? null}
          onSave={async (txt) => { await updateNotes(txt); await reloadMeta(); }}
          disabled={locked}
        />
      </>
    )}
  </section>
);
}
