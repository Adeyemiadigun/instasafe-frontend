import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SessionStatusBadge from "./SessionStatusBadge"
import ChatMessage from "./ChatMessage"
import { formatDate } from "@/lib/utils"
import { Phone, Clock, Bot } from "lucide-react"
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
    // fallback: show raw data as a single message
    if (session.temporaryData) {
      messages = [{ role: "bot", text: session.temporaryData }]
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5" /> {session.phoneNumber}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Bot className="h-3 w-3" /> State</span>
            <SessionStatusBadge state={session.currentState} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Last Activity</span>
            <span>{formatDate(session.lastInteractionAt)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages in this session yet.</p>
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
