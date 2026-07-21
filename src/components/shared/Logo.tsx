import { cn } from "@/lib/utils"

type LogoProps = {
  variant?: "wordmark" | "wordmark-white" | "icon"
  className?: string
}

const srcMap = {
  wordmark: "/logo-wordmark.svg",
  "wordmark-white": "/logo-wordmark-white.svg",
  icon: "/logo-icon.svg",
} as const

export default function Logo({ variant = "wordmark", className }: LogoProps) {
  return (
    <img
      src={srcMap[variant]}
      alt="InstaSafe"
      className={cn("h-10 w-auto", className)}
    />
  )
}
