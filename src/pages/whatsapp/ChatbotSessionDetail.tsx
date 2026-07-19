import { useParams, useNavigate } from "react-router-dom"
import { useChatbotSession } from "@/hooks/useChatbot"
import SessionDetail from "@/components/whatsapp/SessionDetail"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ChatbotSessionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: session, isLoading } = useChatbotSession(id || "")

  if (isLoading) return <LoadingSpinner message="Loading session..." />
  if (!session) return <div className="text-center py-12 text-muted-foreground">Session not found.</div>

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/whatsapp/sessions")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Sessions
      </Button>
      <SessionDetail session={session} />
    </div>
  )
}
