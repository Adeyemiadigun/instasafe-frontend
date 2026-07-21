import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { CHATBOT_STATE_LABELS } from "@/lib/constants"
import type { ChatbotSession } from "@/types/chatbot"

interface SessionTableProps {
  sessions: ChatbotSession[]
}

export default function SessionTable({ sessions }: SessionTableProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
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
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    {CHATBOT_STATE_LABELS[session.currentState]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm tabular-nums">{formatDate(session.lastInteractionAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
