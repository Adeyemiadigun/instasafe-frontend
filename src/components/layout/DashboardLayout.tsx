import { Outlet } from "react-router-dom"
import MerchantSidebar from "./MerchantSidebar"
import AdminSidebar from "./AdminSidebar"
import Header from "./Header"

export default function DashboardLayout({ sidebar }: { sidebar: "merchant" | "admin" }) {
  return (
    <div className="flex h-screen">
      {sidebar === "merchant" ? <MerchantSidebar /> : <AdminSidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
