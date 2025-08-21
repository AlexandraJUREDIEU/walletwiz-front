import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// before request: start loader
api.interceptors.request.use((config) => {
  useUiStore.getState().startLoading();
  let token: string | null = null;
  try {
    token = useAuthStore.getState().token;
  } catch {}
  if (!token) {
    try {
      const raw = localStorage.getItem("walletwiz-auth");
      token = raw ? JSON.parse(raw)?.state?.token ?? null : null;
    } catch {}
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// after response: stop loader
api.interceptors.response.use(
  (res) => {
    useUiStore.getState().stopLoading();
    return res;
  },
  (error) => {
    useUiStore.getState().stopLoading();
    const status = error?.response?.status;
    if (status === 401) {
      try {
        useAuthStore.getState().logout();
      } catch {
        localStorage.removeItem("walletwiz-auth");
      }
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=expired";
      }
    }
    return Promise.reject(error);
  }
);