import { useApi } from '@/lib/useApi';
import type { AuthPayload, OtpPayload, User } from '@/types/auth';
import type { Session } from 'react-router-dom';

type AuthResponse = {
  accessToken: string;
  user: User;
  sessions: Session[];
};

//* 🔹 Service d'authentification
export function useAuthService() {
  const { request } = useApi();

  // 🔹 Service pour l'inscription
  const register = async (payload: AuthPayload) => {
    return await request<{ message: string }>('/auth/register', {
      method: 'POST',
      data: payload,
    });
  };

  // 🔹 Service pour la vérification de l'OTP
  const verifyOtp = async (payload: OtpPayload) => {
    return await request<AuthResponse>('/auth/verify', {
      method: 'POST',
      data: payload,
    });
  };

  // 🔹 Service pour la connexion
  const login = async (payload: AuthPayload) => {
    return await request<AuthResponse>('/auth/login', {
      method: 'POST',
      data: payload,
    });
  };

  // 🔹 Retourne les méthodes du service
  return {
    register,
    verifyOtp,
    login,
  };
}
