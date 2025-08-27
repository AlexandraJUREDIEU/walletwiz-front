// src/hooks/useTxUrlState.ts
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type ClearedFilter = "ALL" | "CLEARED" | "UNCLEARED";

type State = {
  month?: string | null;      // "YYYY-MM"
  bank?: string | null;
  member?: string | null;
  cleared?: ClearedFilter;
  q?: string | null;
};

function getOrNull(v: string | null) {
  return v && v.length ? v : null;
}

export function useTxUrlState(defaults?: Required<State>) {
  const [sp, setSp] = useSearchParams();

  const state: Required<State> = useMemo(() => {
    return {
      month: getOrNull(sp.get("month")) ?? defaults?.month ?? "",
      bank: getOrNull(sp.get("bank")) ?? null,
      member: getOrNull(sp.get("member")) ?? null,
      cleared: (getOrNull(sp.get("cleared")) as ClearedFilter) ?? (defaults?.cleared ?? "ALL"),
      q: getOrNull(sp.get("q")) ?? "",
    };
  }, [sp, defaults]);

  const set = useCallback((next: Partial<State>, opts?: { replace?: boolean }) => {
    const n = new URLSearchParams(sp);
    const entries: [keyof State, any][] = Object.entries(next) as any;
    for (const [k, v] of entries) {
      if (v === undefined) continue;
      if (v === null || v === "" || (k === "cleared" && v === "ALL")) n.delete(k);
      else n.set(k, String(v));
    }
    setSp(n, { replace: opts?.replace ?? true });
  }, [sp, setSp]);

  return [state, set] as const;
}
