import { useState, useEffect, useRef, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronRight } from "lucide-react"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
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

/* ── Custom SVG icons ── */

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
    </svg>
  )
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function CheckVerified({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  )
}

function ClockInstant({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
      <path d="M18 4l2 2-2 2" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v18" />
      <path d="M8 7l4-4 4 4" />
      <path d="M4 7h6l-1 7H5L4 7z" />
      <path d="M14 7h6l-1 7h-4L14 7z" />
      <path d="M5 14l-1 4h5" />
      <path d="M15 14l-1 4h5" />
    </svg>
  )
}

function QRCodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="5" y="5" width="3" height="3" />
      <rect x="16" y="5" width="3" height="3" />
      <rect x="5" y="16" width="3" height="3" />
      <path d="M14 14h3v3h-3z" />
      <path d="M20 14v3h-3" />
      <path d="M14 20h3v-3" />
    </svg>
  )
}

/* ── Product UI Mockup — auto-sliding between WhatsApp chat & web dashboard ── */

function WhatsAppScreen() {
  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-2.5 px-4 pb-2.5 border-b border-border/30">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <span className="text-primary text-[10px] font-bold">IS</span>
        </div>
        <div>
          <p className="font-semibold text-[11px]">InstaSafe Bot</p>
          <p className="text-[9px] text-primary font-medium">online</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 px-4 py-3 space-y-2.5 overflow-hidden">
        <div className="flex justify-end">
          <div className="bg-primary/10 rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]">
            <p className="text-[10px] text-foreground leading-relaxed">iPhone 15 Pro Max, {"\u20A6"}850,000, deliver to Lekki Phase 1</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-card border border-border/40 rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
            <p className="text-[10px] text-muted-foreground leading-relaxed">Got it! Here&apos;s what I understood:</p>
            <div className="mt-1.5 space-y-0.5">
              <p className="text-[10px]"><span className="text-muted-foreground">Item:</span> <span className="font-medium">iPhone 15 Pro Max</span></p>
              <p className="text-[10px]"><span className="text-muted-foreground">Price:</span> <span className="font-medium">{"\u20A6"}850,000</span></p>
              <p className="text-[10px]"><span className="text-muted-foreground">Delivery:</span> <span className="font-medium">Lekki Phase 1</span></p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Confirm? Reply <span className="font-semibold text-foreground">Yes</span> or <span className="font-semibold text-foreground">No</span></p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-primary/10 rounded-xl rounded-tr-sm px-3 py-2">
            <p className="text-[10px] text-foreground font-medium">Yes</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-card border border-border/40 rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
            <p className="text-[10px] text-foreground leading-relaxed">Order <span className="font-bold">CB-A1B2C3</span> created!</p>
            <div className="mt-1.5 bg-primary/5 rounded-lg px-2.5 py-1.5 border border-primary/10">
              <p className="text-[9px] text-primary font-semibold">Escrow Link</p>
              <p className="text-[9px] text-muted-foreground truncate">pay.instasafe.com/CB-A1B2C3</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Share this link with your buyer.</p>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border/30">
        <div className="flex-1 bg-muted rounded-full px-3 py-1.5">
          <span className="text-[10px] text-muted-foreground">Type a message...</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6h8M7 3l3 3-3 3" /></svg>
        </div>
      </div>
    </div>
  )
}

function WebDashboardScreen() {
  return (
    <div className="h-full flex flex-col">
      {/* App header */}
      <div className="px-4 pb-2.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-display font-bold text-[11px]">InstaSafe</span>
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-[8px] font-bold">AM</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 overflow-hidden">
        {/* Order card */}
        <div className="bg-card rounded-xl p-3 border border-border/40 mb-2.5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-[10px]">iPhone 15 Pro Max</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Order #CB-A1B2C3</p>
            </div>
            <span className="text-[8px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">ESCROW</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-sm">{"\u20A6"}850,000</span>
            <span className="text-[9px] text-muted-foreground">Just now</span>
          </div>
        </div>

        {/* Status steps */}
        <div className="space-y-1.5">
          {[
            { label: "Order Created", done: true },
            { label: "Buyer Paid", done: true },
            { label: "Delivery Pending", done: false, active: true },
            { label: "Funds Released", done: false },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                s.done ? "bg-primary" : s.active ? "bg-primary/20 ring-2 ring-primary/30" : "bg-muted"
              }`}>
                {s.done && (
                  <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 6l2.5 2.5 4.5-4.5" /></svg>
                )}
                {s.active && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </div>
              <span className={`text-[9px] font-medium ${s.done ? "text-foreground" : s.active ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around border-t border-border/30 px-4 py-2">
        {["Home", "Orders", "Scan", "Settings"].map((t, i) => (
          <div key={t} className="flex flex-col items-center gap-0.5">
            <div className={`w-3.5 h-3.5 rounded-sm ${i === 1 ? "bg-primary" : "bg-muted"}`} />
            <span className={`text-[7px] ${i === 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductMockup() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % 2), 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="relative bg-foreground rounded-[2rem] p-3 shadow-xl">
        <div className="bg-background rounded-[1.5rem] overflow-hidden">
          {/* Status bar — always visible */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2 relative z-10">
            <span className="text-[10px] font-semibold text-muted-foreground">9:41</span>
            <div className="flex gap-1">
              <div className="w-3.5 h-2 rounded-sm bg-foreground/30" />
              <div className="w-1 h-2 rounded-sm bg-foreground/30" />
            </div>
          </div>

          {/* Sliding screens */}
          <div className="overflow-hidden h-[340px]">
            <div
              className="flex h-full transition-transform duration-700 ease-spring"
              style={{ transform: `translateX(-${active * 50}%)`, width: "200%" }}
            >
              <div className="w-1/2 h-full flex-shrink-0">
                <WhatsAppScreen />
              </div>
              <div className="w-1/2 h-full flex-shrink-0">
                <WebDashboardScreen />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {["WhatsApp", "Dashboard"].map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-all duration-300 ${
              active === i
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Data ── */

const steps = [
  { icon: CreditCardIcon, title: "List Your Item", desc: "Create an order with item details and price. Your unique escrow link is generated instantly." },
  { icon: ShieldIcon, title: "Buyer Pays Securely", desc: "Buyer clicks the link and pays into a verified escrow account. Funds are held safely." },
  { icon: TruckIcon, title: "QR-Verified Delivery", desc: "Both parties scan QR codes to confirm pickup and delivery. Device fingerprinting prevents fraud." },
  { icon: CheckVerified, title: "Funds Released", desc: "Once delivery is confirmed, funds are released to you instantly. Disputes resolved within 24 hours." },
]

const features = [
  { icon: ShieldCheck, title: "Escrow Protection", desc: "Every transaction backed by our secure escrow system. Buyers pay with confidence, sellers get paid on delivery.", large: true },
  { icon: ClockInstant, title: "Instant Settlement", desc: "No more waiting. Funds released the moment delivery is confirmed.", dark: true },
  { icon: WhatsAppIcon, title: "Message to Order", desc: "Send a WhatsApp message with item details — our AI extracts the item, price, and location, then creates an escrow order automatically.", dark: false },
  { icon: ScalesIcon, title: "Dispute Resolution", desc: "24-hour dispute window with AI-assisted resolution. Fair outcomes for both parties.", dark: true },
  { icon: QRCodeIcon, title: "QR Delivery Tracking", desc: "Scan-to-confirm with device fingerprinting. Every delivery verified and timestamped.", dark: false },
]

const testimonials = [
  {
    quote: "InstaSafe changed how I sell on Instagram. My buyers trust me now because they know their money is safe until they get their order.",
    name: "Chioma Adekunle",
    role: "Fashion Merchant, Lagos Island",
    initials: "CA",
  },
  {
    quote: "I was scammed twice before finding InstaSafe. Now I never pay for anything without escrow protection. It changed everything for me.",
    name: "Emeka Okonkwo",
    role: "Buyer, Wuse II Abuja",
    initials: "EO",
  },
  {
    quote: "The QR verification means I never worry about delivery disputes. Everything is timestamped and verified. My dispute rate dropped to zero.",
    name: "Fatima Bello",
    role: "Electronics, Kano Trade Fair",
    initials: "FB",
  },
]

/* ── Components ── */

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView(0.15)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-spring ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const { ref, inView } = useInView(0.2)
  return (
    <div
      ref={ref}
      className={`relative text-center transition-all duration-700 ease-spring ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="relative z-10 w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
        <step.icon className="h-7 w-7" />
      </div>
      <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
    </div>
  )
}

function FeatureCard({ feat, index }: { feat: typeof features[0]; index: number }) {
  const { ref, inView } = useInView(0.1)
  const isDark = feat.dark
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl p-6 transition-all duration-500 ease-spring ${
        feat.large ? "md:col-span-2 md:p-8" : ""
      } ${
        isDark
          ? "bg-foreground text-background"
          : "bg-card border border-border/40"
      } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`rounded-xl flex items-center justify-center mb-4 ${feat.large ? "w-14 h-14" : "w-11 h-11"} ${isDark ? "bg-white/10" : "bg-primary/5"}`}>
        <feat.icon className={`${feat.large ? "h-7 w-7" : "h-5.5 w-5.5"} ${isDark ? "text-background" : "text-primary"}`} />
      </div>
      <h3 className={`font-display font-semibold text-lg mb-2 ${isDark ? "text-background" : "text-foreground"}`}>{feat.title}</h3>
      <p className={`leading-relaxed ${isDark ? "text-background/70" : "text-muted-foreground"}`}>{feat.desc}</p>
    </div>
  )
}

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroAnim = useInView(0.1)
  const statsAnim = useInView(0.2)

  return (
    <div className="min-h-screen">
      {/* ── Header — text-only logo ── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/logo-wordmark.svg" alt="InstaSafe" className="h-14" />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <a href="#how-it-works" className="hover:text-foreground transition-colors duration-300">How It Works</a>
            <a href="#features" className="hover:text-foreground transition-colors duration-300">Features</a>
          </nav>
          <div className="hidden md:flex gap-3">
            <Link to="/auth/login"><Button variant="ghost" size="sm" className="font-medium">Login</Button></Link>
            <Link to="/auth/register"><Button size="sm" className="font-medium">Get Started</Button></Link>
          </div>
          <button
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-muted transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-6 py-4 space-y-3">
            <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>How It Works</a>
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground py-1" onClick={() => setMobileOpen(false)}>Features</a>
            <div className="flex gap-3 pt-3">
              <Link to="/auth/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm" className="w-full font-medium">Login</Button></Link>
              <Link to="/auth/register" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full font-medium">Get Started</Button></Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero — product mockup instead of stock photo ── */}
      <section ref={heroAnim.ref} className="relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-[1fr_1fr] gap-12 md:gap-16 items-center">
            {/* Left: text */}
            <div className="max-w-xl">
              <Reveal delay={0}>
                <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary text-xs font-semibold tracking-wide uppercase px-3.5 py-1.5 rounded-full mb-6">
                  Trusted by 500+ Nigerian Merchants
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="text-4xl md:text-[3.5rem] leading-[1.1] font-display font-bold tracking-tight mb-6">
                  Sell with Confidence.{" "}
                  <span className="font-editorial italic text-primary">Buy without Fear.</span>
                </h1>
              </Reveal>

              <Reveal delay={180}>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                  InstaSafe holds your payment in escrow until delivery is confirmed.
                  Every transaction protected, every delivery verified.
                </p>
              </Reveal>

              <Reveal delay={260}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/auth/register">
                    <Button size="lg" className="text-base px-7 bg-primary hover:bg-primary/90 font-semibold">
                      Start Selling Securely <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button size="lg" variant="outline" className="text-base px-7 font-semibold border-border/60">
                      See How It Works
                    </Button>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right: product UI mockup */}
            <Reveal delay={200} className="hidden md:block">
              <ProductMockup />
            </Reveal>
          </div>

          {/* Trust badges */}
          <Reveal delay={500}>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-14 pt-8 border-t border-border/40">
              {["Escrow Protected", "QR Verified Delivery", "24h Dispute Resolution", "Instant Settlement"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats — dark section ── */}
      <section ref={statsAnim.ref} className="bg-foreground text-background">
        <div className="container mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { target: 500, suffix: "+", label: "Merchants" },
              { target: 12500, suffix: "+", label: "Orders Secured" },
              { target: 28, suffix: "M+", label: "NGN Protected", prefix: "\u20A6" },
              { target: 99, suffix: "%", label: "Resolution Rate" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`transition-all duration-600 ease-spring ${statsAnim.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-display font-bold">
                  {stat.prefix}<AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-sm mt-1.5 opacity-60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works — solid connector line ── */}
      <section id="how-it-works" className="container mx-auto px-6 py-24 md:py-32">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Four steps to secure, verified transactions.</p>
          </div>
        </Reveal>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector line — solid, no gradient, centered at 28px */}
          <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-[2px] bg-primary/20" />

          <div className="grid md:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — alternating dark/light cards ── */}
      <section id="features" className="bg-muted/40 py-24 md:py-32">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="mb-16">
              <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-3">Built for Nigeria</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">Everything You Need</h2>
              <p className="text-muted-foreground text-lg max-w-xl">Every feature designed for trust and speed in the Nigerian e-commerce ecosystem.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
            {features.map((feat, i) => (
              <FeatureCard key={feat.title} feat={feat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials — real names, editorial layout ── */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <Reveal>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Trusted Across Nigeria</h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-5 max-w-5xl">
          {/* Featured testimonial */}
          <Reveal delay={0}>
            <div className="bg-card rounded-2xl p-8 flex flex-col justify-between h-full border border-border/40">
              <div>
                <blockquote className="text-foreground text-lg leading-relaxed mb-6 font-medium">
                  &ldquo;{testimonials[0].quote}&rdquo;
                </blockquote>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">{testimonials[0].initials}</div>
                <div>
                  <p className="text-sm font-semibold">{testimonials[0].name}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[0].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Stacked testimonials */}
          <div className="flex flex-col gap-5">
            {testimonials.slice(1).map((t, i) => (
              <Reveal key={t.name} delay={(i + 1) * 100}>
                <div className="bg-card rounded-2xl p-6 border border-border/40">
                  <blockquote className="text-foreground text-sm leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-xs">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — dark, editorial ── */}
      <section className="bg-foreground text-background">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <Reveal>
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight mb-4">
                Ready to Sell <span className="font-editorial italic text-primary">Securely</span>?
              </h2>
              <p className="text-lg opacity-60 mb-10 max-w-lg leading-relaxed">
                Join 500+ Nigerian merchants who trust InstaSafe for every transaction.
              </p>
              <Link to="/auth/register">
                <Button size="lg" className="text-base px-8 bg-primary hover:bg-primary/90 text-white font-semibold">
                  Create Free Account <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer — text-only logo ── */}
      <footer className="border-t border-border/50 bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo-wordmark.svg" alt="InstaSafe" className="h-8" />
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Secure escrow payments for Nigerian e-commerce. Every transaction, verified.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors duration-200">How It Works</a></li>
                <li><a href="#features" className="hover:text-foreground transition-colors duration-200">Features</a></li>
                <li><Link to="/auth/register" className="hover:text-foreground transition-colors duration-200">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="opacity-40">About</span></li>
                <li><span className="opacity-40">Blog</span></li>
                <li><a href="mailto:support@instasafe.com" className="hover:text-foreground transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="opacity-40">Privacy Policy</span></li>
                <li><span className="opacity-40">Terms of Service</span></li>
                <li><span className="opacity-40">Escrow Terms</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>InstaSafe &copy; {new Date().getFullYear()}. All rights reserved. Built for Nigerian e-commerce.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
