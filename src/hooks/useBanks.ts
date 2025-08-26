import { useCallback, useEffect, useRef, useState } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import { useBankAccountsService } from "@/lib/service/bank-account.service"; // ton nom de fichier
import type { BankAccount } from "@/types";

export function useBanks() {
  const { currentSessionId } = useSessionStore();

  // ✅ hook appelé au top-level
  const { getBySession } = useBankAccountsService();

  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);

  // garde une référence stable vers la fonction du service
  const getBySessionRef = useRef(getBySession);
  useEffect(() => {
    getBySessionRef.current = getBySession;
  }, [getBySession]);

  // évite requêtes concurrentes en StrictMode
  const inFlightRef = useRef(false);

  const refresh = useCallback(
    async (sessionId?: string) => {
      const sid = sessionId ?? currentSessionId;
      if (!sid) {
        setBanks([]);
        return;
      }
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setLoading(true);
      try {
        const list = await getBySessionRef.current(sid);
        setBanks(list);
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [currentSessionId] // 🔑 volontairement pas getBySession
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { banks, loading, refresh, currentSessionId };
}