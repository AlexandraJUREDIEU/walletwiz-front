import type { AxiosError } from "axios";

export type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
  [k: string]: unknown;
};

export function extractErrorMessage(err: unknown, fallback = "Une erreur est survenue") {
  const ax = err as AxiosError<ApiErrorPayload>;
  // Priorité : payload.message -> axios.message -> fallback
  return ax?.response?.data?.message
    || ax?.message
    || fallback;
}