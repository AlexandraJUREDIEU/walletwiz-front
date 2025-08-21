import { useCallback } from "react";
import type { AxiosRequestConfig } from "axios";
import { api } from "./client";
import { extractErrorMessage } from "./errors";
import { toast } from "sonner";

type Options = {
  silent?: boolean; // si true: pas de toast d'erreur auto
};

export function useApi(defaultOptions: Options = {}) {
  const notifyError = useCallback((e: unknown, silent?: boolean) => {
    if (silent || defaultOptions.silent) return;
    toast.error(extractErrorMessage(e));
  }, [defaultOptions.silent]);

  const get = useCallback(async <T = unknown>(url: string, config?: AxiosRequestConfig, opts?: Options) => {
    try {
      const { data } = await api.get<T>(url, config);
      return data;
    } catch (e) {
      notifyError(e, opts?.silent);
      throw e;
    }
  }, [notifyError]);

  const post = useCallback(async <T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig, opts?: Options) => {
    try {
      const { data } = await api.post<T>(url, body, config);
      return data;
    } catch (e) {
      notifyError(e, opts?.silent);
      throw e;
    }
  }, [notifyError]);

  const put = useCallback(async <T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig, opts?: Options) => {
    try {
      const { data } = await api.put<T>(url, body, config);
      return data;
    } catch (e) {
      notifyError(e, opts?.silent);
      throw e;
    }
  }, [notifyError]);

  const patch = useCallback(async <T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig, opts?: Options) => {
    try {
      const { data } = await api.patch<T>(url, body, config);
      return data;
    } catch (e) {
      notifyError(e, opts?.silent);
      throw e;
    }
  }, [notifyError]);

  const del = useCallback(async <T = unknown>(url: string, config?: AxiosRequestConfig, opts?: Options) => {
    try {
      const { data } = await api.delete<T>(url, config);
      return data;
    } catch (e) {
      notifyError(e, opts?.silent);
      throw e;
    }
  }, [notifyError]);

  return { get, post, put, patch, del };
}