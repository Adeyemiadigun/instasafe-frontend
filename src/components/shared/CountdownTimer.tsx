import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function CountdownTimer({ expiresAt, className }: { expiresAt: string; className?: string }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const target = new Date(expiresAt).getTime()
    const update = () => {
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) {
        setTimeLeft("Expired")
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const isUrgent = new Date(expiresAt).getTime() - Date.now() < 60 * 60 * 1000

  return (
    <span className={cn("font-mono text-sm font-medium", isUrgent ? "text-red-600" : "text-muted-foreground", className)}>
      {timeLeft}
    </span>
  )
}
