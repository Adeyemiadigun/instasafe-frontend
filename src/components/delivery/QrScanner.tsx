import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { AlertCircle } from "lucide-react"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

interface QrScannerProps {
  onScan: (decodedText: string) => void
  onError: (error: string) => void
}

export default function QrScanner({ onScan, onError }: QrScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isStarting, setIsStarting] = useState(true)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scanner = new Html5Qrcode("qr-reader")
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          scanner.stop().catch(() => {})
          onScan(decodedText)
        },
        () => {}
      )
      .then(() => setIsStarting(false))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to start camera"
        onError(msg)
      })

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
      scannerRef.current = null
    }
  }, [onScan, onError])

  return (
    <div className="space-y-3">
      {isStarting && <LoadingSpinner message="Starting camera..." />}
      <div id="qr-reader" ref={containerRef} className="w-full rounded-lg overflow-hidden" aria-label="QR code camera viewfinder" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <p>Point your camera at the QR code shown by the merchant.</p>
      </div>
    </div>
  )
}
