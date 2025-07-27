import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  console.log('🧠 user in store:', user);
  return token ? children : <Navigate to="/auth/login" replace />;
};
export default ProtectedRoute;
