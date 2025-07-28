import { useApi } from '@/lib/useApi';
import type { AuthPayload, OtpPayload, User } from '@/types/auth';
import type { Session } from '@/types/session';

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

  // 🔹 Service pour demander la réinitialisation du mot de passe
  const forgetPassword = async (email: string) => {
    return await request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      data: { email },
    });
  };

  // 🔹 Service pour réinitialiser le mot de passe
  const resetPassword = async (token: string, newPassword: string) => {
    return await request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      data: { token, newPassword },
    });
  };

  // 🔹 Retourne les méthodes du service
  return {
    register,
    verifyOtp,
    login,
    forgetPassword,
    resetPassword,    
  };
}
