import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { ApiResult } from "@/types"
import type { ChatbotSession } from "@/types/chatbot"

export function useChatbotSessions() {
  return useQuery({
    queryKey: ["chatbotSessions"],
    queryFn: () => api.get("/chatbot/sessions"),
    select: (res: { data: ApiResult<ChatbotSession[]> }) => res.data.data ?? [],
  })
}

export function useChatbotSession(sessionId: string) {
  return useQuery({
    queryKey: ["chatbotSession", sessionId],
    queryFn: () => api.get(`/chatbot/sessions/${sessionId}`),
    select: (res: { data: ApiResult<ChatbotSession> }) => res.data.data,
    enabled: !!sessionId,
  })
}
