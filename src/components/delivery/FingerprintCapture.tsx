import { useEffect, useState } from "react"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { Loader2, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FingerprintCaptureProps {
  onCapture: (fingerprint: string) => void
}

export default function FingerprintCapture({ onCapture }: FingerprintCaptureProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const captureFingerprint = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      onCapture(result.visitorId)
    } catch {
      setError("Failed to capture device fingerprint. Please try again.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void captureFingerprint()
  }, [])

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm text-muted-foreground">Capturing device fingerprint...</p>
        </div>
      )}
      {error && (
        <div className="text-center space-y-3">
          <p className="text-sm text-destructive">{error}</p>
          <Button onClick={captureFingerprint} variant="outline" size="sm">
            <Fingerprint className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      )}
    </div>
  )
}
