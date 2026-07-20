import { NavLink } from "react-router-dom"
import { LayoutDashboard, Package, AlertTriangle, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"

const merchantLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/orders", icon: Package, label: "Orders" },
  { to: "/dashboard/disputes", icon: AlertTriangle, label: "Disputes" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export default function MerchantSidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-full border-r bg-card h-screen flex flex-col">
      <div className="p-6 border-b">
        <NavLink to="/dashboard" className="text-xl font-bold text-emerald-600">
          InstaSafe
        </NavLink>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {merchantLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
