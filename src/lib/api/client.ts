import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Injecte le token s'il existe
api.interceptors.request.use((config) => {
  let token = null;
  try {
    token = useAuthStore.getState().token;
  } catch {
    // noop (store non dispo au tout premier import)
  }

  if (!token) {
    try {
      const raw = localStorage.getItem("walletwiz-auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed?.state?.token ?? null;
      }
    } catch {
      // noop
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gère les erreurs globales (401 -> logout)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        useAuthStore.getState().logout();
      } catch {
        // fallback: nettoie localStorage si besoin
        localStorage.removeItem("walletwiz-auth");
      }
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=expired";
      }
    }
    return Promise.reject(error);
  }
);