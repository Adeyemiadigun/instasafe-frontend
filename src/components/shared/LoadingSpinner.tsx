import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoadingSpinner({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-8", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
