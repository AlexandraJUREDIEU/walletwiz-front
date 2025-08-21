import { useSyncExternalStore } from "react";
import { useUiStore } from "@/stores/uiStore";

function useIsLoading() {
  const subscribe = (cb: () => void) => {
    const unsub = useUiStore.subscribe(cb);
    return unsub;
  };
  const getSnapshot = () => useUiStore.getState().isLoading();
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export default function GlobalLoader() {
  const loading = useIsLoading();
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-background/60 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-2 shadow">
        <span className="size-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        <span className="text-sm text-muted-foreground">Chargement…</span>
      </div>
    </div>
  );
}