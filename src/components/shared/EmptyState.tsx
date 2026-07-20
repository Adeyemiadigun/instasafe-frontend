import { type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-muted/60 mb-5">
        <Icon className="h-10 w-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-5">
          {action.label}
        </Button>
      )}
    </div>
  )
}
