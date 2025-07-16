import type { User } from '@/types/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('walletwiz-token', token) // optionnel si tu veux doubler
        set({ user, token })
      },
      logout: () => {
        localStorage.removeItem('walletwiz-token')
        set({ user: null, token: null })
      },
    }),
    {
      name: 'walletwiz-auth', // stockage global
    }
  )
)