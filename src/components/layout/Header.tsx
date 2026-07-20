import { useAuth } from "@/providers/AuthProvider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, LogOut, User } from "lucide-react"

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "?"

  return (
    <header className="h-16 flex-shrink-0 border-b border-border/60 bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full">
          <Avatar className="h-9 w-9 ring-2 ring-border/60 ring-offset-2 ring-offset-card">
            <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary to-teal-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold font-[family-name:var(--font-display)]">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
