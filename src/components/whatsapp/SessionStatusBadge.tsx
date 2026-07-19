import { Badge } from "@/components/ui/badge"
import { CHATBOT_STATE_LABELS } from "@/lib/constants"
import type { ChatbotState } from "@/types/chatbot"

const STATE_COLORS: Record<ChatbotState, string> = {
  Idle: "bg-gray-100 text-gray-700",
  AwaitingOrderAmount: "bg-blue-100 text-blue-700",
  AwaitingOrderDescription: "bg-blue-100 text-blue-700",
  AwaitingOrderBuyerEmail: "bg-blue-100 text-blue-700",
  ConfirmingOrder: "bg-yellow-100 text-yellow-700",
  AwaitingOrderStatusReference: "bg-purple-100 text-purple-700",
}

interface SessionStatusBadgeProps {
  state: ChatbotState
}

export default function SessionStatusBadge({ state }: SessionStatusBadgeProps) {
  return (
    <Badge variant="outline" className={STATE_COLORS[state]}>
      {CHATBOT_STATE_LABELS[state]}
    </Badge>
  )
}
