import { Badge } from "@/components/ui/badge"
import { CHATBOT_STATE_LABELS } from "@/lib/constants"
import type { ChatbotState } from "@/types/chatbot"

interface SessionStatusBadgeProps {
  state: ChatbotState
}

export default function SessionStatusBadge({ state }: SessionStatusBadgeProps) {
  return (
    <Badge variant="outline" className="bg-muted text-muted-foreground">
      {CHATBOT_STATE_LABELS[state]}
    </Badge>
  )
}
