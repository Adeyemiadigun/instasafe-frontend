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

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type ResetFormData = z.infer<typeof resetSchema>

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

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
      <div className="text-center py-4">
        <p className="text-destructive mb-4">Invalid reset link.</p>
        <Link to="/auth/forgot-password"><Button variant="outline">Request new link</Button></Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  )
}
