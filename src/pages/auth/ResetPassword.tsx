import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "@/lib/api"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState } from "react"
import { ArrowLeft, Lock } from "lucide-react"

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type ResetFormData = z.infer<typeof resetSchema>

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const email = searchParams.get("email") || ""
  const token = searchParams.get("token") || ""

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetFormData) => {
    setLoading(true)
    try {
      await api.post("/auth/reset-password", { email, token, newPassword: data.password })
      toast.success("Password reset successfully!")
      navigate("/auth/login")
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-[400px] text-center">
          <div className="mb-8">
            <img src="/logo-wordmark.svg" alt="InstaSafe" className="h-8 mx-auto" />
          </div>
          <div className="bg-card rounded-xl border border-border/60 p-8 shadow-xs">
            <Lock className="h-5 w-5 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium mb-4">Invalid reset link.</p>
            <Link to="/auth/forgot-password">
              <Button variant="outline">Request new link</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-10">
          <img src="/logo-wordmark.svg" alt="InstaSafe" className="h-8 mx-auto" />
        </div>

        <div className="text-center space-y-1.5 mb-8">
          <Lock className="h-5 w-5 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="pl-10 pr-10"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}
