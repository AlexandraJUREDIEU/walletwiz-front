import { useEffect, useRef, useState } from "react";
import { useUiStore } from "@/stores/uiStore";

function useLoadingFlag() {
  const subscribe = (cb: () => void) => useUiStore.subscribe(cb);
  const getSnapshot = () => useUiStore.getState().isLoading();
  // petit hook maison sans useSyncExternalStore pour rester simple
  const [flag, setFlag] = useState(getSnapshot());
  useEffect(() => {
    const unsub = subscribe(() => setFlag(getSnapshot()));
    return () => unsub();
  }, []);
  return flag;
}

export default function GlobalLoader() {
  const loading = useLoadingFlag();
  const [visible, setVisible] = useState(false);

  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const becameVisibleAt = useRef<number | null>(null);

  useEffect(() => {
    const MIN_VISIBLE_MS = 400;
    const DELAY_SHOW_MS = 200;

    const clearTimers = () => {
      if (showTimer.current) window.clearTimeout(showTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      showTimer.current = null;
      hideTimer.current = null;
    };

    if (loading) {
      // lancer un show différé
      if (!visible && !showTimer.current) {
        showTimer.current = window.setTimeout(() => {
          setVisible(true);
          becameVisibleAt.current = Date.now();
        }, DELAY_SHOW_MS);
      }
      // si déjà visible, on ne fait rien
    } else {
      // ne plus charger → soit on annule un show pending, soit on cache avec min-time
      if (showTimer.current) {
        // on n’a jamais affiché, on annule, donc rien ne se voit
        clearTimers();
        setVisible(false);
        becameVisibleAt.current = null;
      } else if (visible) {
        const elapsed = becameVisibleAt.current
          ? Date.now() - becameVisibleAt.current
          : MIN_VISIBLE_MS;
        const remain = Math.max(0, MIN_VISIBLE_MS - elapsed);
        hideTimer.current = window.setTimeout(() => {
          setVisible(false);
          becameVisibleAt.current = null;
          clearTimers();
        }, remain);
      }
    }

    return () => clearTimers();
  }, [loading, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-background/60 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-2 shadow">
        <span className="size-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        <span className="text-sm text-muted-foreground">Chargement…</span>
      </div>
    </div>
  );
}