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

function GlassPill({ children, className = "", ...props }: any) {
  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "url(#liquid-glass) blur(8px) brightness(1.15) saturate(1.3)",
          WebkitBackdropFilter: "url(#liquid-glass) blur(8px) brightness(1.15) saturate(1.3)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
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
    <div ref={containerRef} className="relative flex items-center rounded-full bg-white/[0.08] border border-white/[0.12]">
      <motion.div
        className="absolute rounded-full bg-white/20 border border-white/20"
        style={{ height: "100%", top: 0 }}
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
    <div className="relative w-full h-screen overflow-hidden flex flex-col" style={{ fontFamily: font, background: "linear-gradient(135deg, #F63E02 0%, #FF6201 25%, #E57C04 50%, #FAA300 75%, #F3B700 100%)" }}>
      <LiquidGlassFilters />

      {/* Nav */}
      <nav className="relative z-20 flex items-center px-10 py-5">
        <span className="text-white text-2xl font-light tracking-wide w-32">toq</span>
        <div className="flex-1 flex justify-center">
          <NavPill />
        </div>
        <div className="w-32 flex justify-end">
          <GlassPill className="px-5 py-2.5 whitespace-nowrap">
            <a
              href="/getting-started/quickstart/"
              className="text-white text-base font-light no-underline flex items-center gap-2"
            >
              Get Started <span className="text-sm">↗</span>
            </a>
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
          className="text-6xl md:text-7xl lg:text-8xl font-light italic text-white text-center leading-tight max-w-4xl"
          style={{ fontFamily: font, fontWeight: 300 }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          make your agents <span className="not-italic">toq.</span>
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
          className="mt-10 flex items-center gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <GlassPill className="px-8 py-3">
            <a
              href="/getting-started/quickstart/"
              className="text-white text-base font-light no-underline flex items-center gap-2"
            >
              Get Started <span className="text-sm">↗</span>
            </a>
          </GlassPill>
          <a
            href="https://github.com/toqprotocol"
            className="text-white/60 text-base font-light no-underline hover:text-white/90 transition-colors flex items-center gap-2"
          >
            GitHub <span className="text-sm">▶</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className="relative z-10 px-8 py-5 flex flex-col items-center gap-3 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <span className="text-white/30 text-xs font-light tracking-widest uppercase">
          Works with your favorite frameworks
        </span>
        <div className="flex items-center gap-12">
          <span className="text-white/40 text-lg font-light italic">LangChain</span>
          <span className="text-white/40 text-lg font-light italic">CrewAI</span>
          <span className="text-white/40 text-lg font-light italic">OpenClaw</span>
          <span className="text-white/40 text-lg font-light italic">Python</span>
          <span className="text-white/40 text-lg font-light italic">Go</span>
        </div>
      </motion.div>
    </div>
  )
}
