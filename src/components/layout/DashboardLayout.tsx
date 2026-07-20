import { useState } from "react"
import { Outlet } from "react-router-dom"
import { X } from "lucide-react"
import MerchantSidebar from "./MerchantSidebar"
import AdminSidebar from "./AdminSidebar"
import Header from "./Header"
import { useAuth } from "@/providers/AuthProvider"
import CompleteProfile from "@/pages/merchant/CompleteProfile"

export default function DashboardLayout({ sidebar }: { sidebar: "merchant" | "admin" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  const isMerchant = sidebar === "merchant"
  const isVerified = user?.isVerified

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-60 flex-shrink-0 h-full">
        {sidebar === "merchant" ? <MerchantSidebar /> : <AdminSidebar />}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebar === "merchant" ? <MerchantSidebar /> : <AdminSidebar />}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 focus:outline-none">
          {isMerchant && !isVerified ? <CompleteProfile /> : <Outlet />}
        </main>
      </div>
    </div>
  )
}
