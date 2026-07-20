import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoadingSpinner({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)} role="status" aria-label={message || "Loading"}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        <Loader2 className="h-7 w-7 animate-spin text-primary relative" />
      </div>
      {message && <p className="text-sm text-muted-foreground font-medium">{message}</p>}
    </div>
  )
}
