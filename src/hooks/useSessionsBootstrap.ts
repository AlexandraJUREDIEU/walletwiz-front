import { useEffect, useRef } from "react";
import { useSessionService } from "@/lib/service/session.service";
import { useSessionStore } from "@/stores/sessionStore";
import { toast } from "sonner";

/**
 * Au premier rendu en zone dashboard :
 * 1) charge les sessions
 * 2) choisit une session active (default sinon 1ère)
 * 3) hydrate les membres de la session active
 */
export function useSessionsBootstrap() {
  const bootstrappedRef = useRef(false);
  const { getMySessions, getSessionMembers } = useSessionService();
  const { sessions, currentSessionId, setSessions, setCurrentSession, setMembers } =
    useSessionStore();

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    (async () => {
      try {
        const list = await getMySessions();
        setSessions(list);

        let chosenId = currentSessionId;
        if (!chosenId) {
          const def = list.find((s) => s.isDefault);
          chosenId = def?.id ?? list[0]?.id ?? null;
          if (chosenId) setCurrentSession(chosenId);
        }

        if (chosenId) {
          const ms = await getSessionMembers(chosenId);
          setMembers(chosenId, ms);
        }
      } catch {
        toast.error("Impossible de charger les sessions.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMySessions, getSessionMembers, setSessions, setCurrentSession, setMembers, currentSessionId, sessions]);
}