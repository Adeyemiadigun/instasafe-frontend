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
import { ArrowRight, Lock, Mail, User, Building2, Phone, Eye, EyeOff } from "lucide-react"

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  businessName: z.string().min(2, "Business name is required").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine((dateString) => {
    const dob = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 18;
  }, { message: "You must be at least 18 years old to register" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const { register: registerUser } = useAuth()
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
      {/* Left — Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-foreground items-center justify-center p-12">
        <div className="relative z-10 max-w-md text-white">
          <div className="mb-10">
            <img src="/logo-wordmark-white.svg" alt="InstaSafe" className="h-13" />
          </div>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-4 leading-tight tracking-tight">
            Start selling with confidence
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Join thousands of Nigerian merchants using escrow-protected transactions to build buyer trust.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { value: "2%", label: "Platform fee" },
              { value: "24h", label: "Dispute window" },
              { value: "QR", label: "Delivery verify" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-xs text-white/40 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <img src="/logo-wordmark.svg" alt="InstaSafe" className="h-8" />
          </div>

          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight">Create Account</h1>
            <p className="text-sm text-muted-foreground">Set up your merchant account in minutes</p>
          </div>

          {success ? (
            <div className="text-center py-8 bg-card rounded-xl border border-border/60 px-6">
              <svg className="h-6 w-6 text-emerald-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <p className="text-emerald-700 font-medium mb-2">{success}</p>
              <Link to="/auth/login">
                <Button variant="outline" className="mt-4">Go to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <Input id="firstName" {...register("firstName")} className="pl-10" />
                  </div>
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input id="email" type="email" {...register("email")} className="pl-10" placeholder="you@example.com" />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input id="businessName" {...register("businessName")} className="pl-10" placeholder="Your business name" />
                </div>
                {errors.businessName && <p className="text-xs text-destructive">{errors.businessName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} className="pl-10 pr-10" placeholder="Min 8 characters" />
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input id="phone" {...register("phone")} className="pl-10" placeholder="+234..." />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-semibold mt-2" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
