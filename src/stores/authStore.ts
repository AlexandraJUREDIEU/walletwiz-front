import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "walletwiz-auth", // localStorage key
    }
  )
);