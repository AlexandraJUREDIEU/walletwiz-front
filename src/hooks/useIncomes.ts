import { useCallback, useEffect, useRef, useState } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import { useIncomesService } from "@/lib/service/income.service";
import type { Income } from "@/types";

export function useIncomes() {
  const { currentSessionId } = useSessionStore();
  const svc = useIncomesService();

  // refs pour stabiliser les méthodes du service
  const listBySessionRef = useRef(svc.getBySession);
  useEffect(() => {
    listBySessionRef.current = svc.getBySession;
  }, [svc]);

  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const inFlightRef = useRef(false);

  const refresh = useCallback(
    async (sessionId?: string) => {
      const sid = sessionId ?? currentSessionId;
      if (!sid) return;
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setLoading(true);
      try {
        const list = await listBySessionRef.current(sid);
        setIncomes(list);
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [currentSessionId]
  );

  useEffect(() => {
    void refresh(); // au mount & quand currentSessionId change
  }, [refresh]);

  return {
    currentSessionId,
    incomes,
    loading,
    refresh,
  };
}