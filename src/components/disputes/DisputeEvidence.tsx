import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileImage } from "lucide-react"

interface DisputeEvidenceProps {
  evidenceUrls: string | null
}

export default function DisputeEvidence({ evidenceUrls }: DisputeEvidenceProps) {
  if (!evidenceUrls) return null

  const urls = evidenceUrls
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean)

  if (urls.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileImage className="h-4 w-4" /> Evidence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {urls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border overflow-hidden"
            >
              <img
                src={url}
                alt={`Evidence ${i + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = "none"
                  const parent = target.parentElement
                  if (parent) {
                    const fallback = document.createElement("div")
                    fallback.className = "flex items-center justify-center h-32 text-xs text-muted-foreground"
                    fallback.textContent = url
                    parent.appendChild(fallback)
                  }
                }}
              />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
