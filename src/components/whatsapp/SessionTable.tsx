import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { CHATBOT_STATE_LABELS } from "@/lib/constants"
import type { ChatbotSession, ChatbotState } from "@/types/chatbot"

const STATE_COLORS: Record<ChatbotState, string> = {
  Idle: "bg-gray-100 text-gray-700",
  AwaitingOrderAmount: "bg-blue-100 text-blue-700",
  AwaitingOrderDescription: "bg-blue-100 text-blue-700",
  AwaitingOrderBuyerEmail: "bg-blue-100 text-blue-700",
  ConfirmingOrder: "bg-yellow-100 text-yellow-700",
  AwaitingOrderStatusReference: "bg-purple-100 text-purple-700",
}

interface SessionTableProps {
  sessions: ChatbotSession[]
}

export default function SessionTable({ sessions }: SessionTableProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phone Number</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow
              key={session.id}
              className="cursor-pointer hover:bg-muted/50"
              tabIndex={0}
              onClick={() => navigate(`/whatsapp/sessions/${session.id}`)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/whatsapp/sessions/${session.id}`) } }}
            >
              <TableCell className="font-medium font-mono">{session.phoneNumber}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATE_COLORS[session.currentState]}`}>
                  {CHATBOT_STATE_LABELS[session.currentState]}
                </span>
              </TableCell>
              <TableCell>{formatDate(session.lastInteractionAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
