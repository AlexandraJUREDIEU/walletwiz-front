import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "@/stores/auth.selectors";

export default function PublicRoute() {
  const isAuth = useIsAuthenticated();
  if (isAuth) {
    return <Navigate to="/dashboard/home" replace />;
  }
  return <Outlet />;
}