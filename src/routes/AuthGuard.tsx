import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "@/stores/auth.selectors";

export default function AuthGuard() {
  const isAuth = useIsAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    // on mémorise d’où on vient pour y retourner après login
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <Outlet />; // rend les routes enfants si OK
}