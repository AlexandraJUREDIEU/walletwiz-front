import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import PublicRoute from "./PublicRoute";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Pages (placeholders si besoin)
import LoginPage from "@/pages/login";
import DashboardHome from "@/pages/dashboard/home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Zone publique */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            {/* Exemple: <Route path="/register" element={<RegisterPage />} /> */}
          </Route>
        </Route>

        {/* Zone privée */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard/home" element={<DashboardHome />} />
            {/* Tu ajouteras ici: /dashboard/profile, /members, /banks, etc. */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />
          </Route>
        </Route>

        {/* Redirect racine */}
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

        {/* 404 minimal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}