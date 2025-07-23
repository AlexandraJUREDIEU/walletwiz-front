import type { Session as WalletwizSession } from '@/types/session';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionStore = {
  currentSession: WalletwizSession | null;
  setCurrentSession: (session: WalletwizSession) => void;
};

// * 🔹 Store pour la gestion de la session
export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      currentSession: null,
      setCurrentSession: (session) => set({ currentSession: session }),
    }),
    {
      name: 'walletwiz-session-default',
      partialize: (state) => ({
        currentSession: state.currentSession,
      }),
    }
  )
);