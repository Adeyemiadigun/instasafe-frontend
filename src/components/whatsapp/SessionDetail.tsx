import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SessionStatusBadge from "./SessionStatusBadge"
import ChatMessage from "./ChatMessage"
import { formatDate } from "@/lib/utils"
import type { ChatbotSession } from "@/types/chatbot"

interface SessionDetailProps {
  session: ChatbotSession
}

export default function SessionDetail({ session }: SessionDetailProps) {
  let messages: Array<{ role: "user" | "bot"; text: string }> = []

  try {
    if (session.temporaryData) {
      const parsed = JSON.parse(session.temporaryData)
      if (Array.isArray(parsed.messages)) {
        messages = parsed.messages
      }
    }
  } catch {
    if (session.temporaryData) {
      messages = [{ role: "bot", text: session.temporaryData }]
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{session.phoneNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">State</span>
            <SessionStatusBadge state={session.currentState} />
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Last Activity</span>
            <span className="tabular-nums">{formatDate(session.lastInteractionAt)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No messages in this session yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} text={msg.text} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
