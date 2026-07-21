import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <img src="/logo-wordmark-white.svg" alt="InstaSafe" className="h-12 mx-auto" />
          <p className="text-muted-foreground mt-3">Secure escrow payments for Nigerian e-commerce</p>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
