import { CheckCircle, XCircle } from "lucide-react"

interface DeliveryStatusProps {
  status: "success" | "error"
  message: string
}

export default function DeliveryStatus({ status, message }: DeliveryStatusProps) {
  const isSuccess = status === "success"

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {isSuccess ? (
        <CheckCircle className="h-8 w-8 text-primary" />
      ) : (
        <XCircle className="h-8 w-8 text-destructive" />
      )}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] tracking-tight">
          {isSuccess ? "Delivery Confirmed" : "Delivery Failed"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
