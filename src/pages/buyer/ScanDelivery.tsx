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
import { Camera, ShieldCheck } from "lucide-react"

export default function ScanDelivery() {
  const { orderId } = useParams<{ orderId: string }>()
  const [step, setStep] = useState<"start" | "scan" | "fingerprint" | "confirming" | "done">("start")
  const [qrToken, setQrToken] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [result, setResult] = useState<{ status: "success" | "error"; message: string } | null>(null)
  const confirmDelivery = useConfirmDelivery(orderId || "")

  const handleQrScan = useCallback((decodedText: string) => {
    let token = ""
    let sid = ""
    try {
      const parsed = JSON.parse(decodedText)
      token = parsed.buyerQrToken || parsed.token || decodedText
      sid = parsed.sessionId || ""
    } catch {
      token = decodedText
    }
    setQrToken(token)
    if (sid) {
      setSessionId(sid)
      setStep("fingerprint")
    } else {
      setResult({ status: "error", message: "QR code missing session ID. Please ask the merchant to regenerate the QR code." })
      setStep("done")
    }
  }, [])

  const handleFingerprint = useCallback(async (fp: string) => {
    setStep("confirming")
    try {
      const res = await confirmDelivery.mutateAsync({
        sessionId,
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
  }, [qrToken, sessionId, confirmDelivery])

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">InstaSafe</span>
        </div>

        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-center mb-6 tracking-tight">Confirm Delivery</h1>
        <Card>
          <CardContent className="py-8 space-y-4">
            {step === "start" && (
              <div className="text-center space-y-4">
                <Camera className="h-10 w-10 text-primary/40 mx-auto" />
                <p className="text-muted-foreground leading-relaxed">Scan the QR code from the merchant to confirm delivery.</p>
                <Button onClick={() => setStep("scan")} size="lg" className="h-12 text-base font-semibold">Start Scanning</Button>
              </div>
            )}

            {step === "scan" && (
              <div className="space-y-4">
                <QrScanner onScan={handleQrScan} onError={(e) => toast.error(e)} />
                <Button variant="outline" onClick={() => setStep("start")} className="w-full h-11">Cancel</Button>
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
                <p className="text-primary font-medium">Verifying delivery...</p>
              </div>
            )}

            {step === "done" && result && (
              <div className="text-center space-y-4">
                <DeliveryStatus status={result.status} message={result.message} />
                <Button variant="outline" onClick={() => { setStep("start"); setResult(null); setQrToken("") }} className="h-11">
                  Scan Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
