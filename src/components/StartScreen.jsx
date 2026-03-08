/**
 * StartScreen — Mode Selection page.
 * Shown after the IntroScreen. Displays all 9 levels as cards.
 * Player can click any card to jump to that level, or use "Play All".
 */
import React, { useState } from "react";

const MODE_CARDS = [
  {
    idx:0, icon:"🎨", title:"Primary Colors",
    group:"Foundations", accent:"#6366F1",
    desc:"Identify the 3 primary and 3 secondary colors on the wheel.",
  },
  {
    idx:1, icon:"⚡", title:"Complementary",
    group:"Foundations", accent:"#f59e0b",
    desc:"Find color pairs that sit directly opposite each other.",
  },
  {
    idx:2, icon:"🔺", title:"Triadic",
    group:"Foundations", accent:"#10b981",
    desc:"Select three colors equally spaced to form a triangle.",
  },
  {
    idx:3, icon:"🌊", title:"Analogous",
    group:"Foundations", accent:"#0ea5e9",
    desc:"Pick three neighboring colors that flow harmoniously.",
  },
  {
    idx:4, icon:"🌑", title:"Monochromatic",
    group:"Foundations", accent:"#8b5cf6",
    desc:"Explore light and dark shades of a single hue.",
  },
  {
    idx:5, icon:"💡", title:"RGB Light Lab",
    group:"Foundations", accent:"#ec4899",
    desc:"Mix Red, Green and Blue light to match target colors.",
  },
  {
    idx:6, icon:"🕵️", title:"Scheme Detective",
    group:"Bloom", accent:"#6366F1",
    desc:"Identify which color scheme each palette represents.",
  },
  {
    idx:7, icon:"🔧", title:"Fix the Palette",
    group:"Bloom", accent:"#f59e0b",
    desc:"Spot the one color that breaks the palette.",
  },
  {
    idx:8, icon:"🧠", title:"Memory Challenge",
    group:"Bloom", accent:"#10b981",
    desc:"Memorise colors for 2 seconds — then name the scheme.",
  },
];

function ModeCard({ card, onStart }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onStart(card.idx)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", gap: 8,
        padding: "18px 20px",
        borderRadius: 20,
        background: hov
          ? `linear-gradient(135deg,${card.accent}16,${card.accent}08)`
          : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1.5px solid ${hov ? card.accent + "55" : "rgba(255,255,255,0.60)"}`,
        boxShadow: hov
          ? `0 10px 36px ${card.accent}22, 0 2px 8px rgba(0,0,0,0.05)`
          : "0 2px 12px rgba(0,0,0,0.05)",
        cursor: "pointer", textAlign: "left",
        transform: hov ? "translateY(-3px) scale(1.01)" : "none",
        transition: "all 0.18s ease",
        fontFamily: "var(--font-body)",
        minHeight: 130,
      }}
    >
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize: 28 }}>{card.icon}</span>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "2px 9px", borderRadius: 99,
          background: card.group === "Bloom" ? "rgba(245,158,11,0.14)" : "rgba(99,102,241,0.10)",
          color: card.group === "Bloom" ? "#b45309" : "#4f46e5",
        }}>
          {card.group}
        </span>
      </div>

      <div style={{
        fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700,
        color: "var(--text)", lineHeight: 1.2,
      }}>
        {card.title}
      </div>

      <div style={{
        fontSize: 12, color: "var(--text-muted)", fontWeight: 600,
        lineHeight: 1.55, flex: 1,
      }}>
        {card.desc}
      </div>

      <div style={{
        fontSize: 11, fontWeight: 800, color: card.accent,
        opacity: hov ? 1 : 0.55, transition: "opacity 0.15s",
      }}>
        Play →
      </div>
    </button>
  );
}

export default function StartScreen({ onStart, bestScore = 0, hardUnlocked = false, onStartHard }) {
  const foundations = MODE_CARDS.filter(c => c.group === "Foundations");
  const bloom       = MODE_CARDS.filter(c => c.group === "Bloom");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 15,
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      background: "transparent",
      overflow: "hidden",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px clamp(12px, 4vw, 40px)",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.45)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: "conic-gradient(hsl(0,80%,65%),hsl(60,80%,65%),hsl(120,80%,65%),hsl(180,80%,65%),hsl(240,80%,65%),hsl(300,80%,65%),hsl(360,80%,65%))",
            animation: "spin-slow 8s linear infinite",
            boxShadow: "0 0 20px rgba(99,102,241,0.22)",
          }} />
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
              background: "linear-gradient(135deg,#6366F1,#7C8CFF 50%,#10b981)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", lineHeight: 1,
            }}>
              Color Theory Explorer
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginTop: 2 }}>
              Choose a level
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {bestScore > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.70)", backdropFilter: "blur(8px)",
              borderRadius: 99, padding: "5px 14px",
              border: "1px solid rgba(255,255,255,0.55)",
              fontSize: 12, fontWeight: 800, color: "#6366F1",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              🏆 {bestScore} pts
            </div>
          )}
          <button onClick={() => onStart(0)} style={{
            background: "linear-gradient(135deg,#6366F1,#7C8CFF)",
            color: "white", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 14, padding: "9px 24px",
            borderRadius: 99, cursor: "pointer", border: "none",
            boxShadow: "0 6px 24px rgba(99,102,241,0.38)",
            transition: "transform 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            ▶ Play All
          </button>
          {hardUnlocked && (
            <button onClick={onStartHard} style={{
              background: "linear-gradient(135deg,#ef4444,#f59e0b)",
              color: "white", fontFamily: "var(--font-display)",
              fontWeight: 700, fontSize: 13, padding: "9px 20px",
              borderRadius: 99, cursor: "pointer", border: "none",
              boxShadow: "0 4px 16px rgba(239,68,68,0.32)",
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              🔥 Hard Mode
            </button>
          )}
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div style={{ overflowY: "auto", padding: "16px clamp(12px, 4vw, 40px)" }}>

        {/* Foundations */}
        <SectionDivider label="Foundations" color="#6366F1" bg="rgba(99,102,241,0.10)" />
        <div className="mode-card-grid" style={{ marginBottom: 20 }}>
          {foundations.map(card => (
            <ModeCard key={card.idx} card={card} onStart={onStart} />
          ))}
        </div>

        {/* Bloom */}
        <SectionDivider label="Bloom · Advanced" color="#b45309" bg="rgba(245,158,11,0.12)" />
        <div className="mode-card-grid">
          {bloom.map(card => (
            <ModeCard key={card.idx} card={card} onStart={onStart} />
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        textAlign: "center", padding: "10px 0 12px",
        fontSize: 11, fontWeight: 600, color: "rgba(30,27,75,0.40)",
        background: "rgba(255,255,255,0.28)",
        borderTop: "1px solid rgba(255,255,255,0.38)",
        flexShrink: 0,
      }}>
        9 interactive levels · No account needed
      </div>
    </div>
  );
}

function SectionDivider({ label, color, bg }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ height: 1.5, flex: 1, background: `${color}30`, borderRadius: 99 }} />
      <span style={{
        fontSize: 10, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase",
        color, background: bg, padding: "3px 12px", borderRadius: 99,
      }}>
        {label}
      </span>
      <div style={{ height: 1.5, flex: 1, background: `${color}30`, borderRadius: 99 }} />
    </div>
  );
}
