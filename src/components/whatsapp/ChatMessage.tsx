import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "bot"
  text: string
}

export default function ChatMessage({ role, text }: ChatMessageProps) {
  const isBot = role === "bot"

  return (
    <div className={cn("flex gap-2", isBot ? "justify-start" : "justify-end")}>
      {isBot && <Bot className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />}
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 text-sm",
          isBot ? "bg-muted" : "bg-emerald-600 text-white"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
      {!isBot && <User className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />}
    </div>
  )
}
