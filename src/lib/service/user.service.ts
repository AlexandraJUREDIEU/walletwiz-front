import { useApi } from '@/lib/useApi';
import type { Profile } from '@/types/profile';

export function useUserService() {
  const { request } = useApi();

  const updateUser = async (data: Partial<Profile>, id: string) => {
    return await request(`/users/${id}`, {
      method: 'PATCH',
      data: JSON.stringify(data),
    });
  };

  return {
    updateUser,
  };
}
