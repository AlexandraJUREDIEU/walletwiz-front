import type { Session } from '@/types/session'
import { create } from 'zustand'

type SessionStore = {
    currentSession: Session | null
    setCurrentSession: (session: Session) => void
}

// * 🔹 Store pour la gestion de la session
export const useSessionStore = create<SessionStore>((set) => ({
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),
}))