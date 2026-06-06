import React from "react"
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion"

const CARDS = [
  { label: "Air Fryer 3L", platform: "Shopee", discount: "-40%", price: "₱1,199", color: "#f97316", bg: "#fff7ed" },
  { label: "Korean Skincare Set", platform: "Lazada", discount: "-39%", price: "₱799", color: "#0f146b", bg: "#eef2ff" },
  { label: "USB-C Hub 7-in-1", platform: "AliExpress", discount: "-50%", price: "₱349", color: "#7c3aed", bg: "#f5f3ff" },
]

function FloatingTag({
  frame,
  fps,
  startFrame,
  x,
  y,
  label,
  color,
}: {
  frame: number
  fps: number
  startFrame: number
  x: number
  y: number
  label: string
  color: string
}) {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.8 },
    durationInFrames: 20,
  })
  const floatOffset = Math.sin((frame / fps) * Math.PI * 0.6 + startFrame) * 5
  const opacity = interpolate(frame, [startFrame - 2, startFrame + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + floatOffset - (1 - progress) * 20,
        opacity: opacity * progress,
        transform: `scale(${0.7 + progress * 0.3})`,
        background: "white",
        borderRadius: 20,
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 700,
        color,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  )
}

function DealCard({
  frame,
  fps,
  startFrame,
  card,
  x,
  y,
}: {
  frame: number
  fps: number
  startFrame: number
  card: (typeof CARDS)[number]
  x: number
  y: number
}) {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 1 },
    durationInFrames: 30,
  })
  const floatOffset = Math.sin((frame / fps) * Math.PI * 0.5 + startFrame * 0.2) * 6
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + floatOffset - (1 - progress) * 40,
        opacity,
        transform: `scale(${0.85 + progress * 0.15})`,
        background: "white",
        borderRadius: 16,
        padding: "14px 16px",
        width: 160,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          height: 64,
          borderRadius: 10,
          background: card.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          border: `2px solid ${card.color}22`,
        }}
      >
        <span style={{ fontSize: 26 }}>
          {card.platform === "Shopee" ? "🛒" : card.platform === "Lazada" ? "💄" : "🔌"}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#0f172a",
          lineHeight: 1.3,
          marginBottom: 6,
        }}
      >
        {card.label}
      </div>

      {/* Price + platform */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{card.price}</span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "white",
            background: card.color,
            borderRadius: 8,
            padding: "2px 6px",
          }}
        >
          {card.discount}
        </span>
      </div>

      {/* Platform */}
      <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 4 }}>{card.platform}</div>
    </div>
  )
}

function ScoreMeter({ frame, fps }: { frame: number; fps: number }) {
  const startFrame = 50
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
    durationInFrames: 50,
  })
  const score = Math.round(progress * 9)
  const barWidth = progress * 90
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        borderRadius: 20,
        padding: "14px 20px",
        width: 220,
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        ⚡ SulitScan Score
      </div>
      <div
        style={{
          height: 8,
          background: "#f1f5f9",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barWidth}%`,
            background: "linear-gradient(90deg, #22c55e, #4ade80)",
            borderRadius: 8,
            transition: "width 0.1s",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: "#64748b" }}>Value · Trust · Price</span>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#16a34a" }}>
          {score}/10
        </span>
      </div>
    </div>
  )
}

export const SulitScanHeroAnimation: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.9 },
    durationInFrames: 25,
  })

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)",
        opacity: bgOpacity,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, #bbf7d0 0%, transparent 70%)",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "radial-gradient(circle, #fde68a 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - titleProgress) * -20}px)`,
          opacity: titleProgress,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "white",
            borderRadius: 24,
            padding: "6px 14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <span style={{ fontSize: 16 }}>⚡</span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: -0.3,
            }}
          >
            Sulit<span style={{ color: "#22c55e" }}>Scan</span> PH
          </span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            fontWeight: 600,
            color: "#64748b",
            letterSpacing: 0.2,
          }}
        >
          Find deals that are actually sulit.
        </div>
      </div>

      {/* Deal Cards */}
      <Sequence from={15}>
        <DealCard frame={frame} fps={fps} startFrame={15} card={CARDS[0]} x={18} y={80} />
      </Sequence>
      <Sequence from={28}>
        <DealCard frame={frame} fps={fps} startFrame={28} card={CARDS[1]} x={196} y={65} />
      </Sequence>
      <Sequence from={40}>
        <DealCard frame={frame} fps={fps} startFrame={40} card={CARDS[2]} x={374} y={80} />
      </Sequence>

      {/* Floating tags */}
      <Sequence from={35}>
        <FloatingTag
          frame={frame}
          fps={fps}
          startFrame={35}
          x={20}
          y={260}
          label="🔖 Flash Deal"
          color="#ea580c"
        />
      </Sequence>
      <Sequence from={45}>
        <FloatingTag
          frame={frame}
          fps={fps}
          startFrame={45}
          x={370}
          y={250}
          label="✅ Verified"
          color="#16a34a"
        />
      </Sequence>
      <Sequence from={55}>
        <FloatingTag
          frame={frame}
          fps={fps}
          startFrame={55}
          x={195}
          y={270}
          label="🪙 + Coins"
          color="#d97706"
        />
      </Sequence>

      {/* Score meter */}
      <ScoreMeter frame={frame} fps={fps} />
    </AbsoluteFill>
  )
}
