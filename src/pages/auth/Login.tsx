import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/providers/AuthProvider"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield, ArrowRight, Lock, Mail } from "lucide-react"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success("Welcome back!")
      navigate("/dashboard")
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-teal-600 to-teal-500 items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10 max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-white/15">
              <Shield className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold font-[family-name:var(--font-display)]">InstaSafe</span>
          </div>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-4 leading-tight">
            Secure escrow payments for Nigerian e-commerce
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Every transaction protected, every delivery verified. Buy and sell with confidence.
          </p>
          <div className="mt-10 flex items-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>256-bit encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Escrow protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="p-2 rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-display)]">InstaSafe</span>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input id="email" type="email" {...register("email")} className="pl-10 h-11" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input id="password" type="password" {...register("password")} className="pl-10 h-11" placeholder="Enter your password" />
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? "Signing in..." : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
            <Link to="/auth/forgot-password" className="hover:text-foreground transition-colors">Forgot password?</Link>
            <p>Don't have an account? <Link to="/auth/register" className="text-primary hover:text-primary/80 font-medium transition-colors">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
