// src/hooks/useTransactions.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import { useTransactionsService } from "@/lib/service/transaction.service";
import type {
  DateRange,
  MonthRange,
  Transaction,
  TransactionId,
  CreateTransactionDto,
  UpdateTransactionDto,
  MonthString,
} from "@/types";

function monthToRange(month: MonthString): DateRange {
  // month: "YYYY-MM"
  const [y, m] = month.split("-").map(Number);
  const from = new Date(y, m - 1, 1);
  const to = new Date(y, m, 0); // last day of month
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}
function toMoneyString(v: number | string) {
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toFixed(2);
}

type ClearedFilter = "ALL" | "CLEARED" | "UNCLEARED";

export function useTransactions(input?: Partial<DateRange & MonthRange>) {
  const { currentSessionId } = useSessionStore();
  const svc = useTransactionsService();

  // Stabiliser méthodes (StrictMode)
  const listRef = useRef(svc.listBySession);
  const createRef = useRef(svc.create);
  const updateRef = useRef(svc.update);
  const removeRef = useRef(svc.remove);
  useEffect(() => {
    listRef.current = svc.listBySession;
    createRef.current = svc.create;
    updateRef.current = svc.update;
    removeRef.current = svc.remove;
  }, [svc]);

  // Période : priorité à {from,to}, sinon {month}, sinon mois courant
  const [range, setRange] = useState<DateRange>(() => {
    if (input?.from && input?.to) return { from: input.from, to: input.to };
    const month: MonthString =
      (input as any)?.month ??
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
    return monthToRange(month);
  });
  const setMonth = useCallback((m: MonthString) => setRange(monthToRange(m)), []);

  // Filtres client
  const [bankAccountId, setBankAccountId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [cleared, setCleared] = useState<ClearedFilter>("ALL");
  const [query, setQuery] = useState<string>("");

  // Données
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (!currentSessionId) return;
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    try {
      const list = await listRef.current(currentSessionId, {
        from: range.from,
        to: range.to,
      });
      setItems(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, [currentSessionId, range.from, range.to]);

  useEffect(() => {
    void refresh(); // mount + changement de période/session
  }, [refresh]);

  // Helpers CRUD
  const createTx = useCallback(
    async (data: Omit<CreateTransactionDto, "amount" | "sessionId"> & { amount: number | string }) => {
      if (!currentSessionId) return null;
      const dto: CreateTransactionDto = {
        ...data,
        sessionId: currentSessionId,
        amount: toMoneyString(data.amount),
      };
      const created = await createRef.current(dto);
      await refresh();
      return created;
    },
    [currentSessionId, refresh]
  );

  const updateTx = useCallback(
    async (
        id: TransactionId,
        data: { amount?: number | string } & Omit<UpdateTransactionDto, "amount">
    ) => {
        const { amount, ...rest } = data; // <-- on retire amount du spread
        const dto: UpdateTransactionDto = {
        ...rest,
        ...(amount !== undefined ? { amount: toMoneyString(amount) } : {}),
        };
        const updated = await updateRef.current(id, dto);
        await refresh();
        return updated;
    },
    [refresh]
  );

  const toggleCleared = useCallback(
    async (id: TransactionId, current?: boolean) => {
      const updated = await updateRef.current(id, { isCleared: !current });
      await refresh();
      return updated;
    },
    [refresh]
  );

  const removeTx = useCallback(
    async (id: TransactionId) => {
      await removeRef.current(id);
      await refresh();
    },
    [refresh]
  );

  // Dérivés filtrés/sortis
  const visible = useMemo(() => {
    let rows = items.slice();
    if (bankAccountId) rows = rows.filter((r) => r.bankAccountId === bankAccountId);
    if (memberId) rows = rows.filter((r) => r.memberId === memberId);
    if (cleared !== "ALL") rows = rows.filter((r) => !!r.isCleared === (cleared === "CLEARED"));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((r) => r.label?.toLowerCase().includes(q) || r.notes?.toLowerCase().includes(q));
    }
    // Tri date DESC puis id DESC
    rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1));
    return rows;
  }, [items, bankAccountId, memberId, cleared, query]);

  // Totaux de la période filtrée (client)
  const totals = useMemo(() => {
    return visible.reduce(
      (acc, t) => {
        const n = typeof t.amount === "number" ? t.amount : Number(String(t.amount).replace(",", "."));
        const val = Number.isFinite(n) ? n : 0;
        if (t.type === "INFLOW") acc.in += val;
        else acc.out += val;
        return acc;
      },
      { in: 0, out: 0 }
    );
  }, [visible]);

  return {
    // état
    items,
    visible,     // liste filtrée/triée pour l’UI
    loading,
    range,
    setRange,
    setMonth,

    // filtres
    bankAccountId, setBankAccountId,
    memberId, setMemberId,
    cleared, setCleared,
    query, setQuery,

    // actions
    refresh,
    createTx,
    updateTx,
    toggleCleared,
    removeTx,

    // totaux
    totals,
  };
}
