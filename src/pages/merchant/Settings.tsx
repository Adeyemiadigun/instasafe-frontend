import { useAuth } from "@/providers/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield } from "lucide-react"

export default function Settings() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between py-2.5 border-b border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> Email
              </div>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" /> Roles
              </div>
              <span className="text-sm font-medium">{user?.roles?.join(", ")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Payout Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bank Account Number</label>
                <div className="flex relative">
                  <input 
                    type="text" 
                    placeholder="10-digit account number" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bank</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Select your bank...</option>
                  <option value="044">Access Bank</option>
                  <option value="058">Guaranty Trust Bank</option>
                  <option value="033">United Bank for Africa</option>
                  <option value="011">First Bank of Nigeria</option>
                  <option value="057">Zenith Bank</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">This account will be used for automated disbursements from completed escrow transactions.</p>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                onClick={() => alert('Profile editing endpoints are coming soon!')}
              >
                Save Payout Settings
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
