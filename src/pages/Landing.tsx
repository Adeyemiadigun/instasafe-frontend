import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Shield, CreditCard, Truck, MessageSquare } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">InstaSafe</span>
          <div className="flex gap-3">
            <Link to="/auth/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/auth/register"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Secure Escrow Payments for<br />
          <span className="text-emerald-600">Nigerian E-Commerce</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Protect every transaction with escrow. Buyers pay safely, sellers get paid on delivery.
        </p>
        <Link to="/auth/register">
          <Button size="lg" className="text-lg px-8">Start Selling Securely</Button>
        </Link>
      </section>

      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: CreditCard, title: "1. Create Order", desc: "List your item and set the price. A unique escrow link is generated." },
            { icon: Shield, title: "2. Buyer Pays", desc: "Buyer clicks the link and pays into a secure escrow account." },
            { icon: Truck, title: "3. Safe Delivery", desc: "QR-verified delivery ensures the buyer receives the item before funds release." },
          ].map((step) => (
            <div key={step.title} className="text-center p-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 border-t">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Shield, title: "Escrow Protection", desc: "Funds are held safely until delivery is confirmed by both parties." },
            { icon: Truck, title: "QR Delivery Verification", desc: "Scan-to-confirm delivery with device fingerprinting for fraud prevention." },
            { icon: MessageSquare, title: "WhatsApp Integration", desc: "Create and manage orders directly through WhatsApp chatbot." },
          ].map((feat) => (
            <div key={feat.title} className="p-6 border rounded-lg">
              <feat.icon className="h-8 w-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>InstaSafe &copy; {new Date().getFullYear()}. Secure escrow for Nigerian e-commerce.</p>
      </footer>
    </div>
  )
}
