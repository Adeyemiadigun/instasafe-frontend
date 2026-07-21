import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react"

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const email = searchParams.get("email")
    const token = searchParams.get("token")
    if (!email || !token) {
      setStatus("error")
      setMessage("Invalid verification link.")
      return
    }
    api.post("/auth/verify-email", { email, token })
      .then((res) => {
        const data = res.data
        setStatus("success")
        setMessage(data.Message || data.message || "Email verified successfully!")
      })
      .catch((err) => {
        setStatus("error")
        const msg = err.response?.data?.Message || err.response?.data?.message
        setMessage(msg || "Verification failed. The link may have expired.")
      })
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[400px] text-center">
        <div className="mb-8">
          <img src="/logo-wordmark.svg" alt="InstaSafe" className="h-8 mx-auto" />
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8 shadow-xs">
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <ShieldCheck className="h-7 w-7 text-emerald-600 mx-auto" />
              <p className="text-emerald-700 font-medium">{message}</p>
              <Link to="/auth/login" className="block pt-2">
                <Button className="w-full h-11 font-semibold">Go to Login</Button>
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="h-7 w-7 text-destructive mx-auto" />
              <p className="text-destructive font-medium">{message}</p>
              <Link to="/auth/login" className="block pt-2">
                <Button variant="outline" className="w-full h-11">Go to Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
