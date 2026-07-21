import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  className?: string
  trend?: { value: number; label: string }
}

export default function StatCard({ icon: Icon, label, value, className, trend }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-border/50 bg-card p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)]">{value}</p>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground/50" />
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-border/40">
          <span className={cn("text-xs font-medium", trend.value >= 0 ? "text-muted-foreground" : "text-muted-foreground")}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
