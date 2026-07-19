import { Outlet } from "react-router-dom"

export default function BuyerLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="h-16 border-b bg-background flex items-center px-6">
        <a href="/" className="text-xl font-bold text-emerald-600">InstaSafe</a>
      </header>
      <main className="max-w-3xl mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  )
}
