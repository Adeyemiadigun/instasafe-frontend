import { useAuth } from "@/providers/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Shield } from "lucide-react"

export default function Settings() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-teal-600 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> Email
              </div>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" /> Roles
              </div>
              <span className="text-sm font-medium">{user?.roles?.join(", ")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">Profile editing will be available when backend update endpoints are added.</p>
    </div>
  )
}
