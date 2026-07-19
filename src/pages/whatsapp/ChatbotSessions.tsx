import { useChatbotSessions } from "@/hooks/useChatbot"
import SessionTable from "@/components/whatsapp/SessionTable"
import StatCard from "@/components/shared/StatCard"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import { MessageSquare, Clock, Bot, Users } from "lucide-react"

export default function ChatbotSessions() {
  const { data: sessions, isLoading } = useChatbotSessions()

  if (isLoading) return <LoadingSpinner message="Loading sessions..." />

  const all = sessions ?? []
  const active = all.filter((s) => s.currentState !== "Idle")
  const idle = all.filter((s) => s.currentState === "Idle")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">WhatsApp Sessions</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Sessions" value={all.length} />
        <StatCard icon={Clock} label="Active" value={active.length} />
        <StatCard icon={Bot} label="Idle" value={idle.length} />
        <StatCard icon={MessageSquare} label="Conversations" value={all.length} />
      </div>

      {all.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No sessions yet"
          description="WhatsApp chatbot sessions will appear here when users start conversations."
        />
      ) : (
        <SessionTable sessions={all} />
      )}
    </div>
  )
}
