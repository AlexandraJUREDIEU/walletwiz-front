import type { Session as WalletwizSession } from '@/types/session';
import { create } from 'zustand';

type SessionStore = {
  currentSession: WalletwizSession | null;
  setCurrentSession: (session: WalletwizSession) => void;
};

// * 🔹 Store pour la gestion de la session
export const useSessionStore = create<SessionStore>((set) => ({
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),
}));