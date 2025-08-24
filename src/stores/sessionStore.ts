import type { Member, Session } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";


type SessionState = {
  sessions: Session[];
  currentSessionId: string | null;
  membersBySession: Record<string, Member[]>;

  // actions
  setSessions: (list: Session[]) => void;
  setCurrentSession: (id: string | null) => void;
  setMembers: (sessionId: string, list: Member[]) => void;

  // selectors/helpers
  getCurrentSession: () => Session | null;
  getCurrentMembers: () => Member[]; // members of current session (empty if none)

  reset: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      membersBySession: {},

      setSessions: (list) => set({ sessions: list }),
      setCurrentSession: (id) => set({ currentSessionId: id }),
      setMembers: (sessionId, list) =>
        set({
          membersBySession: {
            ...get().membersBySession,
            [sessionId]: list,
          },
        }),

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get();
        if (!currentSessionId) return null;
        return sessions.find((s) => s.id === currentSessionId) ?? null;
      },

      getCurrentMembers: () => {
        const { currentSessionId, membersBySession } = get();
        if (!currentSessionId) return [];
        return membersBySession[currentSessionId] ?? [];
      },
      reset: () =>
        set({
          sessions: [],
          currentSessionId: null,
          membersBySession: {},
        }),
    }),
    { name: "walletwiz-session" }
  )
);