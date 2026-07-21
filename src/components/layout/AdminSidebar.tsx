import { NavLink } from "react-router-dom"
import { LayoutDashboard, AlertTriangle, MessageSquare, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import Logo from "@/components/shared/Logo"

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/disputes", icon: AlertTriangle, label: "Disputes" },
  { to: "/whatsapp/sessions", icon: MessageSquare, label: "WhatsApp" },
]

export default function AdminSidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-full h-screen flex flex-col bg-card">
      <div className="p-4 pb-2">
        <NavLink to="/admin" className="flex items-center no-underline">
          <Logo />
        </NavLink>
        <p className="text-xs text-muted-foreground mt-1.5 ml-0.5 font-medium uppercase tracking-wider">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-primary" />
                )}
                <link.icon className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          onClick={logout}
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
