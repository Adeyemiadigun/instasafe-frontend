import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface AiSuggestionProps {
  score: number | null;
  summary: string | null;
}

export default function AiSuggestion({ score, summary }: AiSuggestionProps) {
  if (!summary) return null

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground border-border";
    if (score > 80) return "text-emerald-500 border-emerald-500";
    if (score < 40) return "text-destructive border-destructive";
    return "text-yellow-500 border-yellow-500";
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-primary font-[family-name:var(--font-display)] tracking-tight">
          <Sparkles className="h-5 w-5" /> AI Verdict & Confidence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {score !== null && (
            <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreColor(score)} bg-background`}>
              <span className="text-2xl font-bold font-[family-name:var(--font-display)]">{score}%</span>
            </div>
          )}
          <div className="flex-1">
            <div className="p-4 rounded-lg bg-background border border-border/50 text-sm leading-relaxed">
              <strong className="block mb-1 text-foreground">Analysis Summary:</strong>
              <span className="text-muted-foreground">{summary}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
