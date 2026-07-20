import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/providers/AuthProvider"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield, ArrowRight, Mail, Lock, User, Building2, Phone } from "lucide-react"

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  businessName: z.string().min(2, "Business name is required").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const { register: registerUser } = useAuth()
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      const msg = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        businessName: data.businessName,
        dateOfBirth: data.dateOfBirth,
        password: data.password,
        phone: data.phone || undefined,
      })
      setSuccess(msg || "Check your email to verify your account.")
      toast.success("Account created!")
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
            Start selling with confidence
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Join thousands of Nigerian merchants using escrow-protected transactions to build buyer trust.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/10">
              <p className="text-2xl font-bold">2%</p>
              <p className="text-xs text-white/60 mt-1">Platform fee</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10">
              <p className="text-2xl font-bold">24h</p>
              <p className="text-xs text-white/60 mt-1">Dispute window</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10">
              <p className="text-2xl font-bold">QR</p>
              <p className="text-xs text-white/60 mt-1">Delivery verify</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="p-2 rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-display)]">InstaSafe</span>
          </div>

          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Create Account</h1>
            <p className="text-muted-foreground">Set up your merchant account in minutes</p>
          </div>

          {success ? (
            <div className="text-center py-8 bg-card rounded-xl border border-border/60 px-6">
              <div className="p-3 rounded-full bg-emerald-50 w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-emerald-700 font-medium mb-2">{success}</p>
              <Link to="/auth/login">
                <Button variant="outline" className="mt-4">Go to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input id="firstName" {...register("firstName")} className="pl-10 h-10" />
                  </div>
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} className="h-10" />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="email" type="email" {...register("email")} className="pl-10 h-10" placeholder="you@example.com" />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="businessName" {...register("businessName")} className="pl-10 h-10" placeholder="Your business name" />
                </div>
                {errors.businessName && <p className="text-sm text-destructive">{errors.businessName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="h-10" />
                {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="password" type="password" {...register("password")} className="pl-10 h-10" placeholder="Min 8 characters" />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input id="phone" {...register("phone")} className="pl-10 h-10" placeholder="+234..." />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
                {loading ? "Creating account..." : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
