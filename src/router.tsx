import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'

import { ProtectedRoute } from '@/lib/ProtectedRoute'
import LoginPage from '@/pages/login'
import AppLayout from '@/layouts/AppLayout'

// pages dashboard
import ProfilePage from '@/pages/profile'
import MembersPage from '@/pages/members'
import BanksPage from '@/pages/banks'
import IncomesPage from '@/pages/incomes'
import RecurringsPage from '@/pages/recurrings'
import SettingsPage from '@/pages/settings'
import BudgetsPage from '@/pages/budgets'
import DashboardPage from './pages/dashboard'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="banks" element={<BanksPage />} />
        <Route path="incomes" element={<IncomesPage />} />
        <Route path="recurrings" element={<RecurringsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
      </Route>
    </>
  )
)