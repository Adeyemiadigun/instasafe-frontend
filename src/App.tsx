import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

import DashboardLayout from "@/components/layout/DashboardLayout"
import BuyerLayout from "@/components/layout/BuyerLayout"

import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import ForgotPassword from "@/pages/auth/ForgotPassword"

import Landing from "@/pages/Landing"
import NotFound from "@/pages/NotFound"

const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"))
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"))

const MerchantDashboard = lazy(() => import("@/pages/merchant/Dashboard"))
const Orders = lazy(() => import("@/pages/merchant/Orders"))
const CreateOrder = lazy(() => import("@/pages/merchant/CreateOrder"))
const OrderDetail = lazy(() => import("@/pages/merchant/OrderDetail"))
const MerchantDisputes = lazy(() => import("@/pages/merchant/Disputes"))
const Settings = lazy(() => import("@/pages/merchant/Settings"))

const Checkout = lazy(() => import("@/pages/buyer/Checkout"))
const Payment = lazy(() => import("@/pages/buyer/Payment"))
const ScanDelivery = lazy(() => import("@/pages/buyer/ScanDelivery"))
const TrackOrder = lazy(() => import("@/pages/buyer/TrackOrder"))

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"))
const DisputesList = lazy(() => import("@/pages/admin/DisputesList"))
const DisputeDetail = lazy(() => import("@/pages/admin/DisputeDetail"))

const ChatbotSessions = lazy(() => import("@/pages/whatsapp/ChatbotSessions"))
const ChatbotSessionDetail = lazy(() => import("@/pages/whatsapp/ChatbotSessionDetail"))

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner message="Loading..." />}>{children}</Suspense>
}

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

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/verify-email" element={<SuspenseWrap><VerifyEmail /></SuspenseWrap>} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<SuspenseWrap><ResetPassword /></SuspenseWrap>} />

      <Route path="/dashboard" element={<MerchantGuard><DashboardLayout sidebar="merchant" /></MerchantGuard>}>
        <Route index element={<SuspenseWrap><MerchantDashboard /></SuspenseWrap>} />
        <Route path="orders" element={<SuspenseWrap><Orders /></SuspenseWrap>} />
        <Route path="orders/new" element={<SuspenseWrap><CreateOrder /></SuspenseWrap>} />
        <Route path="orders/:id" element={<SuspenseWrap><OrderDetail /></SuspenseWrap>} />
        <Route path="disputes" element={<SuspenseWrap><MerchantDisputes /></SuspenseWrap>} />
        <Route path="settings" element={<SuspenseWrap><Settings /></SuspenseWrap>} />
      </Route>

      <Route element={<BuyerLayout />}>
        <Route path="/order/:orderId" element={<SuspenseWrap><Checkout /></SuspenseWrap>} />
        <Route path="/order/:orderId/pay" element={<SuspenseWrap><Payment /></SuspenseWrap>} />
        <Route path="/order/:orderId/scan" element={<SuspenseWrap><ScanDelivery /></SuspenseWrap>} />
        <Route path="/order/:orderId/track" element={<SuspenseWrap><TrackOrder /></SuspenseWrap>} />
      </Route>

      <Route path="/admin" element={<AdminGuard><DashboardLayout sidebar="admin" /></AdminGuard>}>
        <Route index element={<SuspenseWrap><AdminDashboard /></SuspenseWrap>} />
        <Route path="disputes" element={<SuspenseWrap><DisputesList /></SuspenseWrap>} />
        <Route path="disputes/:id" element={<SuspenseWrap><DisputeDetail /></SuspenseWrap>} />
      </Route>

      <Route path="/whatsapp" element={<AdminGuard><DashboardLayout sidebar="admin" /></AdminGuard>}>
        <Route path="sessions" element={<SuspenseWrap><ChatbotSessions /></SuspenseWrap>} />
        <Route path="sessions/:id" element={<SuspenseWrap><ChatbotSessionDetail /></SuspenseWrap>} />
      </Route>

      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  )
}
