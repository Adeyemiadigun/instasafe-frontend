import { NavLink } from "react-router-dom"
import { LayoutDashboard, AlertTriangle, MessageSquare, LogOut, Shield } from "lucide-react"
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
    <aside className="w-full h-screen flex flex-col bg-card border-r border-border/60">
      <div className="p-5 mx-3 mt-3 rounded-xl bg-gradient-to-br from-primary to-teal-600">
        <NavLink to="/admin" className="flex items-center gap-2.5 text-white no-underline">
          <div className="p-1.5 rounded-lg bg-white/15">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)]">InstaSafe</span>
        </NavLink>
        <p className="text-xs text-white/60 mt-1 ml-[38px] font-medium">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-primary" />
                )}
                <link.icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-border/60">
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
