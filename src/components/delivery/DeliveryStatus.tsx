import { CheckCircle, XCircle } from "lucide-react"

interface DeliveryStatusProps {
  status: "success" | "error"
  message: string
}

export default function DeliveryStatus({ status, message }: DeliveryStatusProps) {
  const isSuccess = status === "success"

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {isSuccess ? (
        <CheckCircle className="h-16 w-16 text-emerald-500" />
      ) : (
        <XCircle className="h-16 w-16 text-destructive" />
      )}
      <h3 className="text-lg font-semibold">
        {isSuccess ? "Delivery Confirmed" : "Delivery Failed"}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">{message}</p>
    </div>
  )
}
