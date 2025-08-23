import { useApi } from "@/lib/api/useApi";
import type { Member, Session } from "@/types";

/**
 * Services Front alignés sur l'API WalletWiz Sessions/Members.
 * Endpoints de référence:
 * - GET /sessions/my
 * - POST /sessions
 * - PATCH /sessions/{sessionId}/default
 * - GET /members/session/{sessionId}
 */
export function useSessionService() {
  const { get, post, patch, del } = useApi();

  // SESSIONS
  const getMySessions = () => get<Session[]>("/sessions/my");
  const createSession = (name: string) => post<Session>("/sessions", { name });
  const setDefaultSession = (id: string) => patch<void>(`/sessions/${id}`, { isDefault: true });
  const updateSession = (id: string, data: Partial<Session>) => patch<void>(`/sessions/${id}`, data);
  const deleteSession = (id: string) => del<void>(`/sessions/${id}`);

  // MEMBERS (lecture)
  const getSessionMembers = (sessionId: string) =>
    get<Member[]>(`/members/session/${sessionId}`);

  return {
    getMySessions,
    createSession,
    setDefaultSession,
    updateSession,
    deleteSession,
    getSessionMembers,
  };
}