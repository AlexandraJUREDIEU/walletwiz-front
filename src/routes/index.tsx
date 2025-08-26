import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthGuard from "./AuthGuard";
import PublicRoute from "./PublicRoute";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import PageSkeleton from "@/components/system/PageSkeleton";

// Pages (placeholders si besoin)
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardHome from "@/pages/dashboard/home";
import SessionSettingsPage from "@/pages/settings/SessionSettingsPage";
import DashboardNotFound from "@/pages/dashboard/NotFound";
import EnterInviteToken from "@/pages/invite/EnterInviteToken";
import AcceptInviteView from "@/pages/invite/AcceptInviteView";

const BanksPage = lazy(() => import("@/pages/banks"));
const MembersPage = lazy(() => import("@/pages/members"));
const IncomesPage = lazy(() => import("@/pages/incomes"));
const ExpensesPage = lazy(() => import("@/pages/expenses"));
const BudgetsPage = lazy(() => import("@/pages/budgets"));
const TransactionsPage = lazy(() => import("@/pages/transactions"));
const ProfilePage = lazy(() => import("@/pages/profile"));

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
            <Route path="/invite" element={<EnterInviteToken />} />
            <Route path="/invite/:token" element={<AcceptInviteView />} />
        </Route>

        {/* Zone privée */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard/home" element={<DashboardHome />} />

            {/* Pages J3 en lazy */}
            <Route
              path="/dashboard/banks"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <BanksPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard/members"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <MembersPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard/incomes"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <IncomesPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard/expenses"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <ExpensesPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard/budgets"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <BudgetsPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard/transactions"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <TransactionsPage />
                </Suspense>
              }
            />
            <Route
              path="/dashboard/settings/profile"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <ProfilePage />
                </Suspense>
              }
            />

            {/* redirection dossier dashboard */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />

            {/* réglages sessions (existant) */}
            <Route path="/dashboard/settings/session" element={<SessionSettingsPage />} />
            <Route path="/dashboard/*" element={<DashboardNotFound />} />
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