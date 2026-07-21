import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold text-muted-foreground/20 mb-4 font-[family-name:var(--font-display)] tracking-tighter">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  )
}
