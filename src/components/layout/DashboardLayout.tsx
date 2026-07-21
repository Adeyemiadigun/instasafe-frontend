import { useState, useEffect, useRef, useCallback } from "react"
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
  const sidebarRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const isMerchant = sidebar === "merchant"
  const isVerified = user?.isVerified

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!mobileMenuOpen) return
    if (e.key === "Escape") {
      setMobileMenuOpen(false)
      return
    }
    if (e.key === "Tab" && sidebarRef.current) {
      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown)
      closeBtnRef.current?.focus()
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen, handleKeyDown])

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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div ref={sidebarRef} className="relative w-64 max-w-[80vw] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebar === "merchant" ? <MerchantSidebar /> : <AdminSidebar />}
            <button
              ref={closeBtnRef}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
          {isMerchant && !isVerified ? <CompleteProfile /> : <Outlet />}
        </main>
      </div>
    </div>
  )
}
