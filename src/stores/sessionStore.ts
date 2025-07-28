import type { Session as WalletwizSession } from '@/types/session';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionStore = {
  currentSession: WalletwizSession | null;
  setCurrentSession: (session: WalletwizSession) => void;
  initSession: (sessions: WalletwizSession[]) => void;
};

// * 🔹 Store pour la gestion de la session
export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      setCurrentSession: (session) => set({ currentSession: session }),
      initSession: (sessions: WalletwizSession[]) => {
        const storedSession = get().currentSession;
        if (!storedSession || !storedSession.id) {
          // Si aucune session stockée, prendre la première session reçue
          if (sessions && sessions.length > 0) {
            set({ currentSession: sessions[0] });
          }
        } else {
          // Sinon, garder la session stockée
          set({ currentSession: storedSession });
        }
      },
    }),
    {
      name: 'walletwiz-session-default',
      partialize: (state) => ({
        currentSession: state.currentSession,
      }),
    }
  )
);
