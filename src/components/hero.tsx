"use client"
import { motion } from "framer-motion"
import React from "react"

const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

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

function MobileMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-white p-2"
        aria-label="Menu"
      >
        <div className="flex flex-col justify-center items-center w-6 h-6 gap-[5px]">
          <motion.div
            className="w-[22px] h-[2px] bg-white rounded-full"
            animate={{
              y: open ? 7 : 0,
              rotate: open ? 45 : 0,
            }}
            transition={{
              y: { duration: 0.25, type: "spring", delay: open ? 0 : 0.15 },
              rotate: { duration: 0.25, type: "spring", delay: open ? 0.15 : 0 },
            }}
          />
          <motion.div
            className="w-[22px] h-[2px] bg-white rounded-full"
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="w-[22px] h-[2px] bg-white rounded-full"
            animate={{
              y: open ? -7 : 0,
              rotate: open ? -45 : 0,
            }}
            transition={{
              y: { duration: 0.25, type: "spring", delay: open ? 0 : 0.15 },
              rotate: { duration: 0.25, type: "spring", delay: open ? 0.15 : 0 },
            }}
          />
        </div>
      </button>

      {open && (
        <motion.div
          className="absolute top-full right-0 mt-1 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative" style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
            <div className="absolute inset-0 rounded-2xl" style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.12) 100%)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            }} />
            <div className="relative z-10 flex flex-col py-2">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="px-6 py-3 text-white/80 text-base font-light no-underline hover:text-white transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col select-none" style={{ fontFamily: font, background: "linear-gradient(180deg, #E57C04 0%, #FAA300 60%, #FFFFFF 100%)" }}>
      <LiquidGlassFilters />

      {/* Noise texture */}
      <div className="absolute inset-0 z-[1] opacity-50 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('/noise.png')", backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />

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
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5">
        <a href="/" className="text-white text-2xl font-light tracking-[-0.06em] whitespace-nowrap no-underline select-none">toq protocol</a>

        {/* Desktop nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavPill />
        </div>
        <div className="hidden md:flex w-40 justify-end">
          <GlassPill href="/getting-started/quickstart/" className="px-5 py-2.5 whitespace-nowrap">
            <span className="text-white text-base font-light flex items-center gap-2">
              Get Started <ArrowUpRight />
            </span>
          </GlassPill>
        </div>

        {/* Mobile hamburger */}
        <MobileMenu />
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
              Get Started <ArrowUpRight />
            </span>
          </GlassPill>
          <a
            href="https://github.com/toqprotocol"
            className="text-white/60 text-base font-light no-underline hover:text-white/90 transition-colors flex items-center gap-2"
          >
            <GitHubIcon /> GitHub
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
