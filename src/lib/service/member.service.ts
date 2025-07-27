import { useApi } from '@/lib/useApi';
import type { Member } from '@/types/members';

export function useMemberService() {
  const { request } = useApi();

  // 🔹 Service pour la consultation des membres d'une session
  const getMembersBySession = async (sessionId: string) => {
    return await request<Member[]>(`/sessions/${sessionId}/members`, {
      method: 'GET',
    });
  };
  return {
    getMembersBySession,
  };
}
