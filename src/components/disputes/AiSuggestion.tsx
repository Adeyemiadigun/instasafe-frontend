import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface AiSuggestionProps {
  suggestion: string | null
}

export default function AiSuggestion({ suggestion }: AiSuggestionProps) {
  if (!suggestion) return null

  return (
    <Card className="border-emerald-200 bg-emerald-50/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
          <Sparkles className="h-4 w-4" /> AI Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-emerald-800">{suggestion}</p>
      </CardContent>
    </Card>
  )
}
