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
      <Icon className="h-8 w-8 text-muted-foreground/30 mb-3" />
      <h3 className="text-sm font-semibold font-[family-name:var(--font-display)]">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-5 btn-press">
          {action.label}
        </Button>
      )}
    </div>
  )
}
