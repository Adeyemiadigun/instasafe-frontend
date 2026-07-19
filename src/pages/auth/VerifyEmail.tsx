import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

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
    <div className="text-center py-4">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <>
          <p className="text-emerald-600 font-medium mb-4">{message}</p>
          <Link to="/auth/login"><Button>Go to Login</Button></Link>
        </>
      )}
      {status === "error" && (
        <>
          <p className="text-destructive mb-4">{message}</p>
          <Link to="/auth/login"><Button variant="outline">Go to Login</Button></Link>
        </>
      )}
    </div>
  )
}
