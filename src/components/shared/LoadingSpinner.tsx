import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoadingSpinner({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)} role="status" aria-label={message || "Loading"}>
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
