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
        console.log('✅ setAuth called with:', user, token)
        set({ user, token })
      },
      logout: () => {
        set({ user: null, token: null })
      },
    }),
    {
      name: 'walletwiz-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
)