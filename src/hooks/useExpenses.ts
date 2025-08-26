// src/hooks/useExpenses.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import { useExpensesService } from "@/lib/service/expense.service";
import type { Expense } from "@/types";

type CreateOrUpdatePayload = {
  label: string;
  amount: number | string; // l'UI peut fournir number
  day: number;
  bankAccountId: string;
  memberId: string;
  isArchived?: boolean;
};

export function useExpenses() {
  const { currentSessionId } = useSessionStore();
  const svc = useExpensesService();

  // stabilisation des méthodes
  const listRef = useRef(svc.listBySession);
  const createRef = useRef(svc.create);
  const updateRef = useRef(svc.update);
  const removeRef = useRef(svc.remove);
  const archiveRef = useRef(svc.archive);
  const restoreRef = useRef(svc.restore);
  useEffect(() => {
    listRef.current = svc.listBySession;
    createRef.current = svc.create;
    updateRef.current = svc.update;
    removeRef.current = svc.remove;
    archiveRef.current = svc.archive;
    restoreRef.current = svc.restore;
  }, [svc]);

  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const inFlight = useRef(false);

  const refresh = useCallback(async (sid?: string) => {
    const sessionId = sid ?? currentSessionId;
    if (!sessionId) return;
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    try {
      const list = await listRef.current(sessionId);
      setExpenses(list);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, [currentSessionId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const visible = useMemo(() => {
    const base = showArchived ? expenses : expenses.filter(e => !e.isArchived);
    return [...base].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return a.label.localeCompare(b.label);
    });
  }, [expenses, showArchived]);

  // helpers conversion amount -> string "xx.yy"
  function toApiAmount(v: number | string) {
    const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
    const safe = Number.isFinite(n) ? n : 0;
    return safe.toFixed(2);
  }

  async function createExpense(input: CreateOrUpdatePayload) {
    if (!currentSessionId) return;
    await createRef.current({
      sessionId: currentSessionId,
      label: input.label,
      amount: toApiAmount(input.amount),
      day: input.day,
      bankAccountId: input.bankAccountId,
      memberId: input.memberId,
      isArchived: input.isArchived,
    });
    await refresh();
  }

  async function updateExpense(id: string, input: Partial<CreateOrUpdatePayload>) {
    const dto: any = { ...input };
    if (input.amount != null) dto.amount = toApiAmount(input.amount);
    await updateRef.current(id, dto);
    await refresh();
  }

  async function deleteExpense(id: string) {
    await removeRef.current(id);
    await refresh();
  }

  async function archiveExpense(id: string) {
    await archiveRef.current(id);
    await refresh();
  }

  async function restoreExpense(id: string) {
    await restoreRef.current(id);
    await refresh();
  }

  return {
    currentSessionId,
    loading,
    expenses,
    visibleExpenses: visible,
    showArchived,
    setShowArchived,

    refresh,
    createExpense,
    updateExpense,
    deleteExpense,
    archiveExpense,
    restoreExpense,
  };
}
