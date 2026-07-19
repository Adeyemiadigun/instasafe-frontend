import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"

import AuthLayout from "@/components/layout/AuthLayout"
import DashboardLayout from "@/components/layout/DashboardLayout"
import BuyerLayout from "@/components/layout/BuyerLayout"

import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import VerifyEmail from "@/pages/auth/VerifyEmail"
import ForgotPassword from "@/pages/auth/ForgotPassword"
import ResetPassword from "@/pages/auth/ResetPassword"

import MerchantDashboard from "@/pages/merchant/Dashboard"
import Orders from "@/pages/merchant/Orders"
import CreateOrder from "@/pages/merchant/CreateOrder"
import OrderDetail from "@/pages/merchant/OrderDetail"
import MerchantDisputes from "@/pages/merchant/Disputes"
import Settings from "@/pages/merchant/Settings"

import Checkout from "@/pages/buyer/Checkout"
import Payment from "@/pages/buyer/Payment"
import ScanDelivery from "@/pages/buyer/ScanDelivery"
import TrackOrder from "@/pages/buyer/TrackOrder"

import AdminDashboard from "@/pages/admin/AdminDashboard"
import DisputesList from "@/pages/admin/DisputesList"
import DisputeDetail from "@/pages/admin/DisputeDetail"

import ChatbotSessions from "@/pages/whatsapp/ChatbotSessions"
import ChatbotSessionDetail from "@/pages/whatsapp/ChatbotSessionDetail"

import Landing from "@/pages/Landing"
import NotFound from "@/pages/NotFound"

function MerchantGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>
  if (!user) return <Navigate to="/auth/login" replace />
  if (!user.roles.includes("Merchant")) return <Navigate to="/not-found" replace />
  return <>{children}</>
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>
  if (!user) return <Navigate to="/auth/login" replace />
  if (!user.roles.includes("Admin")) return <Navigate to="/not-found" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/not-found" element={<NotFound />} />

      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="/dashboard" element={<MerchantGuard><DashboardLayout sidebar="merchant" /></MerchantGuard>}>
        <Route index element={<MerchantDashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/new" element={<CreateOrder />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="disputes" element={<MerchantDisputes />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route element={<BuyerLayout />}>
        <Route path="/order/:orderId" element={<Checkout />} />
        <Route path="/order/:orderId/pay" element={<Payment />} />
        <Route path="/order/:orderId/scan" element={<ScanDelivery />} />
        <Route path="/order/:orderId/track" element={<TrackOrder />} />
      </Route>

      <Route path="/admin" element={<AdminGuard><DashboardLayout sidebar="admin" /></AdminGuard>}>
        <Route index element={<AdminDashboard />} />
        <Route path="disputes" element={<DisputesList />} />
        <Route path="disputes/:id" element={<DisputeDetail />} />
      </Route>

      <Route path="/whatsapp" element={<AdminGuard><DashboardLayout sidebar="admin" /></AdminGuard>}>
        <Route path="sessions" element={<ChatbotSessions />} />
        <Route path="sessions/:id" element={<ChatbotSessionDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  )
}
