import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Shield, CreditCard, Truck, MessageSquare, Menu, X, ChevronRight, Lock, Users, Zap, CheckCircle } from "lucide-react"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView(0.3)
  useEffect(() => {
    if (!inView) return
    let start = 0
    let rafId: number
    const duration = 2000
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [inView, target])
  return <span ref={ref} aria-live="off">{count.toLocaleString()}{suffix}</span>
}

const steps = [
  { icon: CreditCard, title: "List Your Item", desc: "Create an order with item details and price. Your unique escrow link is generated instantly." },
  { icon: Shield, title: "Buyer Pays Securely", desc: "Buyer clicks the link and pays into a verified escrow account. Funds are held safely." },
  { icon: Truck, title: "QR-Verified Delivery", desc: "Both parties scan QR codes to confirm pickup and delivery. Device fingerprinting prevents fraud." },
  { icon: CheckCircle, title: "Funds Released", desc: "Once delivery is confirmed, funds are released to you instantly. Disputes resolved within 24 hours." },
]

const features = [
  { icon: Lock, title: "Escrow Protection", desc: "Every transaction is backed by our secure escrow system. Buyers pay with confidence, sellers get paid on delivery." },
  { icon: Zap, title: "Instant Settlement", desc: "No more waiting for payments. Funds are released the moment delivery is confirmed by both parties." },
  { icon: MessageSquare, title: "WhatsApp Integration", desc: "Create and manage orders directly through WhatsApp. Your customers can shop without leaving the chat." },
  { icon: Shield, title: "Dispute Resolution", desc: "24-hour dispute window with AI-assisted resolution. Fair outcomes for both buyers and merchants." },
  { icon: Truck, title: "QR Delivery Tracking", desc: "Scan-to-confirm with device fingerprinting. Every delivery is verified and timestamped." },
  { icon: Users, title: "Multi-Role Support", desc: "Merchants, buyers, and admins each have tailored dashboards. Full visibility into every transaction." },
]

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const { ref, inView } = useInView(0.2)
  return (
    <div ref={ref} className={`relative text-center transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${index * 150}ms` }}>
      <div className="relative z-10 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
        <step.icon className="h-6 w-6" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald-100 rounded-full items-center justify-center text-emerald-700 text-xs font-bold hidden md:flex">{index + 1}</div>
      <h3 className="font-semibold text-lg mb-2 mt-4">{step.title}</h3>
      <p className="text-sm text-muted-foreground">{step.desc}</p>
    </div>
  )
}

function FeatureCard({ feat, index }: { feat: typeof features[0]; index: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div ref={ref} className={`bg-background border rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
        <feat.icon className="h-5 w-5 text-emerald-600" />
      </div>
      <h3 className="font-semibold mb-2">{feat.title}</h3>
      <p className="text-sm text-muted-foreground">{feat.desc}</p>
    </div>
  )
}

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroAnim = useInView(0.1)
  const statsAnim = useInView(0.2)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-700">InstaSafe</span>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </nav>
          <div className="hidden md:flex gap-3">
            <Link to="/auth/login"><Button variant="ghost" size="sm">Login</Button></Link>
            <Link to="/auth/register"><Button size="sm">Get Started</Button></Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t bg-background px-6 py-4 space-y-3">
            <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>How It Works</a>
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Features</a>
            <div className="flex gap-3 pt-2">
              <Link to="/auth/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm" className="w-full">Login</Button></Link>
              <Link to="/auth/register" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">Get Started</Button></Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section ref={heroAnim.ref} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`transition-all duration-700 ${heroAnim.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Shield className="h-4 w-4" />
                Trusted by 500+ Nigerian Merchants
              </div>
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${heroAnim.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              Sell with Confidence.
              <br />
              <span className="text-emerald-700">Buy without Fear.</span>
            </h1>
            <p className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${heroAnim.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              InstaSafe holds your payment in escrow until delivery is confirmed.
              Every transaction is protected, every delivery is verified.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${heroAnim.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <Link to="/auth/register">
                <Button size="lg" className="text-lg px-8 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                  Start Selling Securely <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8">See How It Works</Button>
              </a>
            </div>
          </div>
          <div className={`flex flex-wrap justify-center gap-8 mt-16 transition-all duration-700 delay-500 ${heroAnim.inView ? "opacity-100" : "opacity-0"}`}>
            {["Escrow Protected", "QR Verified Delivery", "24h Dispute Resolution", "Instant Settlement"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsAnim.ref} className="border-y bg-emerald-600 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { target: 500, suffix: "+", label: "Merchants" },
              { target: 12500, suffix: "+", label: "Orders Secured" },
              { target: 28, suffix: "M+", label: "NGN Protected", prefix: "₦" },
              { target: 99, suffix: "%", label: "Resolution Rate" },
            ].map((stat, i) => (
              <div key={stat.label} className={`transition-all duration-500 ${statsAnim.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-bold">
                   {stat.prefix}<AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-emerald-100 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Four simple steps to secure, verified transactions.</p>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-emerald-200" />
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built for the Nigerian e-commerce ecosystem. Every feature designed for trust and speed.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feat, i) => (
              <FeatureCard key={feat.title} feat={feat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Merchants Across Nigeria</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See what our merchants and buyers are saying about InstaSafe.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { quote: "InstaSafe changed how I sell on Instagram. My buyers trust me now because they know their money is safe until they get their order.", name: "Chioma A.", role: "Fashion Merchant, Lagos" },
            { quote: "I was scammed twice before finding InstaSafe. Now I never pay for anything without escrow protection. It's a game changer.", name: "Emeka O.", role: "Buyer, Abuja" },
            { quote: "The QR verification means I never worry about delivery disputes. Everything is timestamped and verified. My dispute rate dropped to zero.", name: "Fatima B.", role: "Electronics Merchant, Kano" },
          ].map((t) => (
            <div key={t.name} className="bg-background border rounded-xl p-6 flex flex-col">
              <div className="flex gap-1 mb-3 text-emerald-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-sm text-muted-foreground flex-1 mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-12 md:p-16 text-center text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Sell Securely?</h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">Join 500+ Nigerian merchants who trust InstaSafe for every transaction.</p>
            <Link to="/auth/register">
              <Button size="lg" className="text-lg px-8 bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl">
                Create Free Account <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
               <span className="text-xl font-bold text-emerald-700">InstaSafe</span>
              <p className="text-sm text-muted-foreground mt-2">Secure escrow payments for Nigerian e-commerce. Every transaction, verified.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><Link to="/auth/register" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="text-muted-foreground/60">About</span></li>
                <li><span className="text-muted-foreground/60">Blog</span></li>
                <li><a href="mailto:support@instasafe.com" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="text-muted-foreground/60">Privacy Policy</span></li>
                <li><span className="text-muted-foreground/60">Terms of Service</span></li>
                <li><span className="text-muted-foreground/60">Escrow Terms</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>InstaSafe &copy; {new Date().getFullYear()}. All rights reserved. Built for Nigerian e-commerce.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
