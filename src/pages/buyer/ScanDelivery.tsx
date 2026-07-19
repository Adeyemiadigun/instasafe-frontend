import { useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useConfirmDelivery } from "@/hooks/useDelivery"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import QrScanner from "@/components/delivery/QrScanner"
import FingerprintCapture from "@/components/delivery/FingerprintCapture"
import DeliveryStatus from "@/components/delivery/DeliveryStatus"
import { getApiErrorMessage } from "@/lib/errorHandler"
import { toast } from "sonner"
import { Camera } from "lucide-react"

export default function ScanDelivery() {
  const { orderId } = useParams<{ orderId: string }>()
  const confirmDelivery = useConfirmDelivery(orderId || "")
  const [step, setStep] = useState<"start" | "scan" | "fingerprint" | "confirming" | "done">("start")
  const [qrToken, setQrToken] = useState("")
  const [result, setResult] = useState<{ status: "success" | "error"; message: string } | null>(null)

  const handleQrScan = useCallback((decodedText: string) => {
    let token = decodedText
    try {
      const parsed = JSON.parse(decodedText)
      token = parsed.buyerQrToken || parsed.token || parsed
    } catch {
      // raw token string, use as-is
    }
    setQrToken(token)
    setStep("fingerprint")
  }, [])

  const handleFingerprint = useCallback(async (fp: string) => {
    setStep("confirming")
    try {
      const res = await confirmDelivery.mutateAsync({
        sessionId: orderId || "",
        buyerQrToken: qrToken,
        deviceFingerprint: fp,
      })
      const data = res.data
      setResult({ status: "success", message: data.message || "Delivery confirmed successfully!" })
      toast.success("Delivery confirmed!")
    } catch (err) {
      const errorMsg = getApiErrorMessage(err)
      setResult({ status: "error", message: errorMsg })
      toast.error(errorMsg)
    } finally {
      setStep("done")
    }
  }, [qrToken, confirmDelivery, orderId])

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Confirm Delivery</h1>
      <Card>
        <CardContent className="py-6 space-y-4">
          {step === "start" && (
            <div className="text-center space-y-4">
              <Camera className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Scan the QR code from the merchant to confirm delivery.</p>
              <Button onClick={() => setStep("scan")} size="lg">Start Scanning</Button>
            </div>
          )}

          {step === "scan" && (
            <div className="space-y-4">
              <QrScanner onScan={handleQrScan} onError={(e) => toast.error(e)} />
              <Button variant="outline" onClick={() => setStep("start")} className="w-full">Cancel</Button>
            </div>
          )}

          {step === "fingerprint" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">QR code scanned. Capturing device fingerprint...</p>
              <FingerprintCapture onCapture={handleFingerprint} />
            </div>
          )}

          {step === "confirming" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3" />
              <p className="text-emerald-600 font-medium">Verifying delivery...</p>
            </div>
          )}

          {step === "done" && result && (
            <div className="text-center space-y-4">
              <DeliveryStatus status={result.status} message={result.message} />
              <Button variant="outline" onClick={() => { setStep("start"); setResult(null); setQrToken("") }}>
                Scan Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
