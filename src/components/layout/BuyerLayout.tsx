import { Outlet } from "react-router-dom"

export default function BuyerLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="h-16 border-b bg-background flex items-center px-6">
        <a href="/">
          <img src="/logo-wordmark.svg" alt="InstaSafe" className="h-8" />
        </a>
      </header>
      <main className="max-w-3xl mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  )
}
