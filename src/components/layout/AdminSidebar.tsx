import { NavLink } from "react-router-dom"
import { LayoutDashboard, AlertTriangle, MessageSquare, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/disputes", icon: AlertTriangle, label: "Disputes" },
  { to: "/whatsapp/sessions", icon: MessageSquare, label: "WhatsApp" },
]

export default function AdminSidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-full border-r bg-card h-screen flex flex-col">
      <div className="p-6 border-b">
        <NavLink to="/admin" className="text-xl font-bold text-emerald-600">
          InstaSafe Admin
        </NavLink>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => (
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
