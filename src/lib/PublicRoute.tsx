import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { ReactNode } from 'react'

interface PublicRouteProps {
  children: ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  // Si user ou token présent, empêcher accès aux pages publiques
  if (token || user) {
    return <Navigate to="/dashboard/home" replace />
  }
  return children
}

export default PublicRoute
