import { Outlet } from "react-router-dom"
import Logo from "@/components/shared/Logo"

export default function BuyerLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="h-16 border-b bg-background flex items-center px-6">
        <a href="/">
          <Logo />
        </a>
      </header>
      <main className="max-w-3xl mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  )
}
