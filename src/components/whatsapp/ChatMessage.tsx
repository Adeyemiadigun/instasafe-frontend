import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "bot"
  text: string
}

export default function ChatMessage({ role, text }: ChatMessageProps) {
  const isBot = role === "bot"

  return (
    <div className={cn("flex gap-2.5", isBot ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isBot ? "bg-muted text-foreground rounded-tl-md" : "bg-primary text-primary-foreground rounded-tr-md"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  )
}
