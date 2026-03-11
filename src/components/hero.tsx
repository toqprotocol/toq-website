"use client"
import { motion } from "framer-motion"
import React from "react"

const font = "'Apple Garamond', 'Garamond', serif"

const navItems = [
  { label: "Docs", href: "/getting-started/overview/" },
  { label: "Quickstart", href: "/getting-started/quickstart/" },
  { label: "Guides", href: "/guides/message-handlers/" },
  { label: "SDKs", href: "/sdks/python/" },
  { label: "Protocol", href: "/specification/protocol/" },
]

function LiquidGlassFilters() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="liquid-glass" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="1" result="noise" />
          <feDisplacementMap in="blur" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="refracted" />
          <feColorMatrix in="refracted" type="saturate" values="1.4" result="saturated" />
          <feComponentTransfer in="saturated" result="brightened">
            <feFuncR type="linear" slope="1.15" />
            <feFuncG type="linear" slope="1.15" />
            <feFuncB type="linear" slope="1.15" />
          </feComponentTransfer>
          <feComposite in="brightened" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}

function GlassPill({ children, className = "", href, ...props }: any) {
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 })
  const ref = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const inner = (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-full ${href ? "cursor-pointer" : ""} group ${className}`}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(12px) brightness(1.05) saturate(1.2)",
          WebkitBackdropFilter: "blur(12px) brightness(1.05) saturate(1.2)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full transition-all duration-200"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.12) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08), inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className="no-underline"
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {inner}
      </motion.a>
    )
  }
  return inner
}

function NavPill() {
  const [active, setActive] = React.useState(0)
  const [dims, setDims] = React.useState({ left: 0, width: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const refs = React.useRef<(HTMLAnchorElement | null)[]>([])

  React.useEffect(() => {
    const el = refs.current[active]
    if (el) {
      setDims({
        left: el.offsetLeft,
        width: el.offsetWidth,
      })
    }
  }, [active])

  return (
    <div ref={containerRef} className="relative flex items-center rounded-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(12px) brightness(1.05) saturate(1.2)",
          WebkitBackdropFilter: "blur(12px) brightness(1.05) saturate(1.2)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.12) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08), inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          height: "100%",
          top: 0,
          zIndex: 5,
          background: "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.12) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08), inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.12)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        animate={{ left: dims.left, width: dims.width }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
      {navItems.map((item, i) => (
        <a
          key={item.label}
          ref={(el) => { refs.current[i] = el }}
          href={item.href}
          className={`relative z-10 px-6 py-2.5 text-base font-light no-underline transition-colors duration-200 ${
            active === i ? "text-white" : "text-white/70 hover:text-white"
          }`}
          onMouseEnter={() => setActive(i)}
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col select-none" style={{ fontFamily: font, background: "linear-gradient(180deg, #E57C04 0%, #FAA300 60%, #FFFFFF 100%)" }}>
      <LiquidGlassFilters />

      {/* Noise texture */}
      <div className="absolute inset-0 z-[1] opacity-50 pointer-events-none mix-blend-overlay hidden md:block" style={{ backgroundImage: "url('/noise.png')", backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

      {/* Gradient orbs */}
      <div className="absolute inset-0 z-[0] overflow-hidden pointer-events-none hidden md:block">
        <motion.div
          className="absolute rounded-full"
          style={{ width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(246,62,2,0.3) 0%, transparent 70%)", filter: "blur(80px)", top: "-10%", left: "-10%" }}
          animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(243,183,0,0.35) 0%, transparent 70%)", filter: "blur(80px)", top: "20%", right: "-15%" }}
          animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(255,98,1,0.25) 0%, transparent 70%)", filter: "blur(80px)", bottom: "10%", left: "20%" }}
          animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center px-10 py-5">
        <a href="/" className="text-white text-2xl font-light tracking-[-0.06em] w-40 no-underline select-none">toq protocol</a>
        <div className="flex-1 flex justify-center">
          <NavPill />
        </div>
        <div className="w-40 flex justify-end">
          <GlassPill href="/getting-started/quickstart/" className="px-5 py-2.5 whitespace-nowrap">
            <span className="text-white text-base font-light flex items-center gap-2">
              Get Started <span className="text-sm">↗</span>
            </span>
          </GlassPill>
        </div>
      </nav>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <GlassPill className="px-5 py-2">
            <span className="text-white/90 text-base font-light">Now in Alpha</span>
          </GlassPill>
        </motion.div>

        <motion.h1
          className="text-center"
          style={{ fontFamily: font, fontWeight: 300 }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="block text-2xl md:text-3xl lg:text-4xl font-light italic text-white/70 -mb-12 md:-mb-16 lg:-mb-20 tracking-[-0.05em]">make your agents</span>
          <span className="block text-[10rem] md:text-[14rem] lg:text-[18rem] font-light text-white leading-none tracking-[-0.06em]">toq</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-lg md:text-xl font-light text-white/60 text-center max-w-lg leading-relaxed"
          style={{ fontFamily: font, fontWeight: 300 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          No central server, no vendor lock-in. Install in one command,
          send your first message in under five minutes.
        </motion.p>

        <motion.div
          className="mt-5 flex items-center gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <GlassPill href="/getting-started/quickstart/" className="px-8 py-3">
            <span className="text-white text-base font-light flex items-center gap-2">
              Get Started <span className="text-sm">↗</span>
            </span>
          </GlassPill>
          <a
            href="https://github.com/toqprotocol"
            className="text-white/60 text-base font-light no-underline hover:text-white/90 transition-colors flex items-center gap-2"
          >
            GitHub <span className="text-sm">▶</span>
          </a>
        </motion.div>
      </div>

      {/* Framework logos */}
      <motion.div
        className="relative z-10 px-8 pb-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <span className="text-neutral-400 text-xs font-light tracking-widest uppercase">
          Works with your favorite frameworks
        </span>
        <div className="flex items-center gap-12">
          <div className="opacity-40 hover:opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="/logos/langchain.svg" alt="LangChain" className="h-10" />
          </div>
          <div className="opacity-40 hover:opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="/logos/crewai.svg" alt="CrewAI" className="h-10" />
          </div>
          <div className="opacity-40 hover:opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="/logos/openclaw.svg" alt="OpenClaw" className="h-10" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
