import { useAuthStore } from "@/stores/authStore";

export const useIsAuthenticated = () =>
  useAuthStore((s) => Boolean(s.user && s.token));