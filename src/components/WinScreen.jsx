import React from "react";
import { getRank } from "./StatsOverlay.jsx";

const BADGES = [
  { icon: "🎨", label: "Color Wheel",   color: "#4F7BFF" },
  { icon: "🌊", label: "Analogous",     color: "#10b981" },
  { icon: "⚡", label: "Complementary", color: "#f59e0b" },
  { icon: "🌑", label: "Monochromatic", color: "#8b5cf6" },
  { icon: "💡", label: "RGB Light",     color: "#3b82f6" },
];

export default function WinScreen({ onRestart, score = 0, best = 0, accuracy = 0 }) {
  const rank = getRank(accuracy);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 20, padding: 32, textAlign: "center",
    }}>
      <div style={{ fontSize: 64 }} className="anim-pop">🌈</div>

      {/* Rank badge */}
      <div className="anim-pop" style={{
        background: "white", border: `2px solid ${rank.color}55`,
        borderRadius: 16, padding: "12px 24px",
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: "var(--shadow-lg)",
      }}>
        <span style={{ fontSize: 32 }}>{rank.icon}</span>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.06em" }}>You earned</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20,
            fontWeight: 700, color: rank.color }}>{rank.label}</div>
        </div>
      </div>

      {/* Score cards */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        {[
          { label: "Score", value: score, color: "#4F7BFF" },
          { label: "Best",  value: best,  color: score >= best ? "#10b981" : "var(--text-muted)" },
          { label: "Accuracy", value: `${accuracy}%`, color: rank.color },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "white", borderRadius: 14, padding: "12px 18px",
            textAlign: "center", border: "1.5px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28,
              fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700,
          background: "linear-gradient(90deg, #4F7BFF, #06B6D4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          marginBottom: 6,
        }}>Color Theory Complete!</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 300, margin: "0 auto", lineHeight: 1.6 }}>
          You've learned the foundations of color theory. A new challenge awaits in Hard Mode!
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {BADGES.map((b, i) => (
          <div key={i} style={{
            background: "white", border: `1.5px solid ${b.color}44`,
            borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700,
            color: b.color, display: "flex", alignItems: "center", gap: 6,
            animation: `popIn 0.4s ease ${i * 0.1}s both`,
            boxShadow: "var(--shadow)",
          }}>
            {b.icon} {b.label} ✓
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onRestart} style={{
          background: "linear-gradient(135deg, #4F7BFF, #6366F1)",
          color: "white", fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: 16, padding: "13px 32px",
          borderRadius: 99, boxShadow: "0 6px 24px rgba(79,123,255,0.35)",
          transition: "transform 0.15s ease",
        }}
          onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        >
          Play Again 🔄
        </button>
      </div>
    </div>
  );
}
