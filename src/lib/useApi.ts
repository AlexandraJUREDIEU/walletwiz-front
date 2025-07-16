import axios, { type AxiosRequestConfig, AxiosError } from 'axios'
import { useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function useApi() {
  const token = useAuthStore((s) => s.token)

  const request = useCallback(
    async <T>(
      url: string,
      config: AxiosRequestConfig = {}
    ): Promise<{ data?: T; error?: string }> => {
      try {
        const response = await axios(`${API_URL}${url}`, {
          ...config,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...config.headers,
          },
        })

        return { data: response.data }
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || axiosError.message
        return { error: message }
      }
    },
    [token]
  )

  return { request }
}