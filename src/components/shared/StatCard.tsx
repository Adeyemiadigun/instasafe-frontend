import { type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)]">{value}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <span className={cn("text-xs font-medium", trend.value >= 0 ? "text-emerald-600" : "text-red-500")}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
