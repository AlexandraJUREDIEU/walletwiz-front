import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import { useBudgetsService } from "@/lib/service/budget.service";
import type { Budget, BudgetSummary, MonthString } from "@/types";

// util interne
function toMonthString(d = new Date()): MonthString {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}` as MonthString;
}
function toMoneyString(v: number | string) {
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toFixed(2);
}
const num = (s: string | number | null | undefined) =>
  Number(String(s ?? "0").replace(",", "."));

export function useBudgetSummary(initialMonth?: MonthString) {
  const { currentSessionId } = useSessionStore();
  const svc = useBudgetsService();

  // stabiliser les méthodes
  const getSummaryRef = useRef(svc.getSummary);
  const getByMonthRef = useRef(svc.getByMonth);
  const updateRef = useRef(svc.update);
  useEffect(() => {
    getSummaryRef.current = svc.getSummary;
    getByMonthRef.current = svc.getByMonth;
    updateRef.current = svc.update;
  }, [svc]);

  const [month, setMonth] = useState<MonthString>(initialMonth ?? toMonthString());
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (!currentSessionId || !month) return;
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    try {
      const s = await getSummaryRef.current(currentSessionId, month, { createIfMissing: true });
      setSummary(s);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, [currentSessionId, month]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // navigation mois
  const goPrevMonth = useCallback(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2, 1);
    setMonth(toMonthString(d));
  }, [month]);

  const goNextMonth = useCallback(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m, 1);
    setMonth(toMonthString(d));
  }, [month]);

  // assure un budgetId (ton summary utilise désormais "budget")
  const ensureBudgetId = useCallback(async (): Promise<string | null> => {
    if (!currentSessionId) return null;
    if (summary?.budget) return summary.budget; // <-- changement ici
    try {
      const b = await getByMonthRef.current(currentSessionId, month);
      return (b as Budget)?.id ?? null;
    } catch {
      return null;
    }
  }, [currentSessionId, month, summary?.budget]);

  // actions
  const lock = useCallback(async () => {
    const id = await ensureBudgetId();
    if (!id) return;
    await updateRef.current(id, { locked: true });
    await refresh();
  }, [ensureBudgetId, refresh]);

  const unlock = useCallback(async () => {
    const id = await ensureBudgetId();
    if (!id) return;
    await updateRef.current(id, { locked: false });
    await refresh();
  }, [ensureBudgetId, refresh]);

  const updateOpening = useCallback(async (amount: number | string) => {
    const id = await ensureBudgetId();
    if (!id) return;
    await updateRef.current(id, { openingBalance: toMoneyString(amount) });
    await refresh();
  }, [ensureBudgetId, refresh]);

  const updateNotes = useCallback(async (notes: string | null) => {
    const id = await ensureBudgetId();
    if (!id) return;
    await updateRef.current(id, { notes: notes ?? null });
    await refresh();
  }, [ensureBudgetId, refresh]);

  // KPIs dérivés (plats selon ton typage)
  const kpis = useMemo(() => {
    if (!summary) return null;
    const opening = num(summary.openingBalance);

    const plannedIn = num(summary.plannedIncome);
    const plannedOut = num(summary.plannedExpense);
    const netPlanned = num(summary.netPlanned);
    const projectedEndBalance = num(summary.projectedEndBalance);

    const actualIn = num(summary.actualInFlow);
    const actualOut = num(summary.actualOutFlow);
    const netActual = num(summary.netActual);
    const endingBalance = num(summary.endingBalance);

    const clearedIn = num(summary.clearedInFlow);
    const clearedOut = num(summary.clearedOutFlow);
    const netCleared = num(summary.netCleared);
    const clearedEndingBalance = num(summary.clearedEndingBalance);

    return {
      opening,
      plannedIn,
      plannedOut,
      netPlanned,
      projectedEndBalance,
      actualIn,
      actualOut,
      netActual,
      endingBalance,
      clearedIn,
      clearedOut,
      netCleared,
      clearedEndingBalance,
    };
  }, [summary]);

  return {
    // état
    month,
    setMonth, goPrevMonth, goNextMonth,
    summary,
    loading,
    kpis,

    // actions
    refresh,
    lock, unlock,
    updateOpening, updateNotes,
  };
}
