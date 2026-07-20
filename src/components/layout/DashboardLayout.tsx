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

  // Intercept unverified merchants
  const isMerchant = sidebar === "merchant"
  const isVerified = user?.isVerified

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r bg-card h-full">
        {sidebar === "merchant" ? <MerchantSidebar /> : <AdminSidebar />}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 max-w-sm bg-card h-full flex flex-col shadow-xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex-1 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
              {sidebar === "merchant" ? <MerchantSidebar /> : <AdminSidebar />}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          {isMerchant && !isVerified ? <CompleteProfile /> : <Outlet />}
        </main>
      </div>
    </div>
  )
}
