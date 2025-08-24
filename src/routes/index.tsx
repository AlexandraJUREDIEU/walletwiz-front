import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import PublicRoute from "./PublicRoute";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Pages (placeholders si besoin)
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardHome from "@/pages/dashboard/home";
import SessionSettingsPage from "@/pages/settings/SessionSettingsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Zone publique */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>

        {/* Zone privée */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard/home" element={<DashboardHome />} />
            {/* Tu ajouteras ici: /dashboard/profile, /members, /banks, etc. */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />
            <Route path="/dashboard/settings/session" element={<SessionSettingsPage />} />
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