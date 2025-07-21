import { useApi } from '@/lib/useApi'
import type { CreatePayload, InvitePayload, Session } from '@/types/session'


export function useSessionService() {
  const { request } = useApi()

  // 🔹 Service pour la consultation des sessions
  const getSessions = async () => {
    return await request<Session[]>('/sessions', {
      method: 'GET'
      })
    }

  // 🔹 Service pour la création d'une session
  const createSession = async (payload: CreatePayload) => {
    return await request<Session>('/sessions', {
      method: 'POST',
      data: payload,
    })
  }

  // 🔹 Service pour la mise à jour d'une session
  const inviteToSession = async (sessionId: string, payload: InvitePayload) => {
    return await request<Session>(`/sessions/${sessionId}/invite`, {
      method: 'POST',
      data: payload,
    })
  }

  // 🔹 Retourne les méthodes du service
  return {
    getSessions,
    createSession,
    inviteToSession
  }
}