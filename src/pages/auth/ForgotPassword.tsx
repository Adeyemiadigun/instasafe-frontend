import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail } from "lucide-react"
import Logo from "@/components/shared/Logo"

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormData) => {
    setLoading(true)
    try {
      await api.post("/auth/forgot-password", { email: data.email })
      setSent(true)
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-10">
          <Logo />
        </div>

        <div className="space-y-1.5 mb-8">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="text-center py-8 bg-card rounded-xl border border-border/60 px-6">
            <svg className="h-6 w-6 text-emerald-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
            <p className="text-emerald-700 font-medium mb-4 text-sm">If an account exists with that email, you'll receive a reset link.</p>
            <Link to="/auth/login">
              <Button variant="outline" className="h-10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input id="email" type="email" {...register("email")} className="pl-10" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
