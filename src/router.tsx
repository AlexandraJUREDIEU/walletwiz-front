import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import ProtectedRoute from "@/lib/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AppLayout from "@/layouts/AppLayout";

// pages dashboard
import ProfilePage from "@/pages/profile";
import MembersPage from "@/pages/members";
import BanksPage from "@/pages/banks";
import IncomesPage from "@/pages/incomes";
import ExpensesPage from "@/pages/expenses";
import SettingsPage from "@/pages/settings";
import BudgetsPage from "@/pages/budgets/budgets";
import DashboardPage from "@/pages/dashboard";
import BudgetInitPage from "@/pages/budgets/init/budgetInitPage";
import CurrentBudgetPage from "./pages/budgets/currentBudgetPage";
import Test from "./pages/Test";
import VerifyInvitePage from "./pages/verifyInvite";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="auth/register" element={<RegisterPage />} />
      <Route path="auth/login" element={<LoginPage />} />
      <Route path="verify-invite" element={<VerifyInvitePage />} />

      {/* Redirect root to login */}

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="test" element={<Test />} />
        <Route path="home" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="banks" element={<BanksPage />} />
        <Route path="incomes" element={<IncomesPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="budgets/init" element={<BudgetInitPage />} />
        <Route
          path="/dashboard/budgets/:budgetMonth"
          element={<CurrentBudgetPage />}
        />
      </Route>
    </>
  )
);
