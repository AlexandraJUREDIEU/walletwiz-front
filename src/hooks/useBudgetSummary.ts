import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import { useBudgetsService } from "@/lib/service/budget.service";
import type { Budget, BudgetSummary, MonthString } from "@/types";

function toMonthString(d: Date = new Date()): MonthString {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
function toMoneyString(v: number | string) {
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toFixed(2);
}
const toNum = (s: string | number | null | undefined) =>
  Number(String(s ?? "0").replace(",", "."));

export function useBudgetSummary(initialMonth?: MonthString) {
  const { currentSessionId } = useSessionStore();
  const svc = useBudgetsService();

  // Stabilisation des méthodes (StrictMode-safe)
  const getSummaryRef = useRef(svc.getSummary);
  const getByMonthRef = useRef(svc.getByMonth);
  const updateRef = useRef(svc.update);
  const createRef = useRef(svc.create);
  useEffect(() => {
    getSummaryRef.current = svc.getSummary;
    getByMonthRef.current = svc.getByMonth;
    updateRef.current = svc.update;
    createRef.current = svc.create;
  }, [svc]);

  const [month, setMonth] = useState<MonthString>(initialMonth ?? toMonthString());
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  // Charge le résumé avec fallback auto (createIfMissing=true)
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

  // Navigation mois
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

  // Assure un budget existant, sinon le crée. Met à jour summary.budget avec l'objet Budget.
  const ensureBudgetIdOrCreate = useCallback(
    async (opts?: { opening?: number | string; notes?: string | null }): Promise<string | null> => {
      if (!currentSessionId) return null;

      // 1) Déjà présent dans le summary (objet Budget) ?
      if (summary?.budget?.id) return summary.budget.id;

      // 2) Essaye de récupérer le budget par mois (si créé ailleurs)
      try {
        const b = await getByMonthRef.current(currentSessionId, month);
        if (b?.id) {
          setSummary(prev => (prev ? { ...prev, budget: b } : prev));
          return b.id;
        }
      } catch {
        // 404 attendu si inexistant
      }

      // 3) Crée un budget si absent
      try {
        const opening = toMoneyString(opts?.opening ?? summary?.openingBalance ?? "0");
        const created = await createRef.current({
          sessionId: currentSessionId,
          month,
          openingBalance: opening,
          notes: opts?.notes ?? summary?.budget?.notes ?? null,
        });
        if (created?.id) {
          setSummary(prev => (prev ? { ...prev, budget: created } : prev));
          return created.id;
        }
        return null;
      } catch {
        return null;
      }
    },
    [currentSessionId, month, summary]
  );

  // Expose aussi l'objet Budget (sans 404) pour l'UI
  const getOrCreateBudget = useCallback(async (): Promise<Budget | null> => {
    // Si le summary embarque déjà le budget complet, retourne-le
    if (summary?.budget?.id) return summary.budget;

    // Sinon, tente lecture ; si ok, synchronise et renvoie
    if (currentSessionId) {
      try {
        const b = await getByMonthRef.current(currentSessionId, month);
        if (b?.id) {
          setSummary(prev => (prev ? { ...prev, budget: b } : prev));
          return b;
        }
      } catch {
        // ignore
      }
    }

    // Sinon, crée et renvoie un objet minimal si l'API n'est pas encore consistante
    const id = await ensureBudgetIdOrCreate();
    if (!id || !currentSessionId) return null;
    return (
      summary?.budget ?? {
        id,
        sessionId: currentSessionId,
        month,
        openingBalance: summary?.openingBalance ?? "0.00",
        notes: null,
        locked: false,
      }
    );
  }, [summary, currentSessionId, month, ensureBudgetIdOrCreate]);

  // Actions
  const lock = useCallback(async () => {
    const id = await ensureBudgetIdOrCreate();
    if (!id) return;
    await updateRef.current(id, { locked: true });
    await refresh();
  }, [ensureBudgetIdOrCreate, refresh]);

  const unlock = useCallback(async () => {
    const id = await ensureBudgetIdOrCreate();
    if (!id) return;
    await updateRef.current(id, { locked: false });
    await refresh();
  }, [ensureBudgetIdOrCreate, refresh]);

  const updateOpening = useCallback(
    async (amount: number | string) => {
      const id = await ensureBudgetIdOrCreate({ opening: amount });
      if (!id) return;
      await updateRef.current(id, { openingBalance: toMoneyString(amount) });
      await refresh();
    },
    [ensureBudgetIdOrCreate, refresh]
  );

  const updateNotes = useCallback(
    async (notes: string | null) => {
      const id = await ensureBudgetIdOrCreate({ notes });
      if (!id) return;
      await updateRef.current(id, { notes: notes ?? null });
      await refresh();
    },
    [ensureBudgetIdOrCreate, refresh]
  );

  // KPIs numériques (champs plats du summary)
  const kpis = useMemo(() => {
    if (!summary) return null;
    return {
      opening: toNum(summary.openingBalance),
      plannedIn: toNum(summary.plannedIncome),
      plannedOut: toNum(summary.plannedExpense),
      netPlanned: toNum(summary.netPlanned),
      projectedEndBalance: toNum(summary.projectedEndBalance),
      actualIn: toNum(summary.actualInFlow),
      actualOut: toNum(summary.actualOutFlow),
      netActual: toNum(summary.netActual),
      endingBalance: toNum(summary.endingBalance),
      clearedIn: toNum(summary.clearedInFlow),
      clearedOut: toNum(summary.clearedOutFlow),
      netCleared: toNum(summary.netCleared),
      clearedEndingBalance: toNum(summary.clearedEndingBalance),
    };
  }, [summary]);

  return {
    // état
    month,
    setMonth,
    goPrevMonth,
    goNextMonth,
    summary,
    loading,
    kpis,

    // actions
    refresh,
    lock,
    unlock,
    updateOpening,
    updateNotes,

    // helper pour l'UI
    getOrCreateBudget,
  };
}