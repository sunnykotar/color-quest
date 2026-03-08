/**
 * IntroScreen — the very first screen when the game loads.
 * Full-viewport centred splash. One button → Mode Select.
 */
import React, { useState } from "react";

export default function IntroScreen({ onEnter }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 20,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      {/* Soft frosted panel */}
      <div className="anim-fade" style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1.5px solid rgba(255,255,255,0.65)",
        borderRadius: 32,
        boxShadow: "0 24px 64px rgba(0,0,0,0.10)",
        padding: "52px 64px",
        maxWidth: 520, width: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 28,
        textAlign: "center",
      }}>

        {/* Spinning colour ring */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "conic-gradient(hsl(0,80%,65%),hsl(60,80%,65%),hsl(120,80%,65%),hsl(180,80%,65%),hsl(240,80%,65%),hsl(300,80%,65%),hsl(360,80%,65%))",
          animation: "spin-slow 7s linear infinite",
          boxShadow: "0 0 36px rgba(99,102,241,0.28)",
          flexShrink: 0,
        }} />

        {/* Title */}
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 6vw, 52px)",
            fontWeight: 700,
            background: "linear-gradient(135deg,#6366F1 0%,#7C8CFF 45%,#10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            Color Theory<br />Explorer
          </h1>
          <p style={{
            fontSize: 16, color: "var(--text-muted)", fontWeight: 600,
            lineHeight: 1.65, maxWidth: 360, margin: "0 auto",
          }}>
            Learn how colors work through interactive challenges and puzzles.
            Discover primary colors, complementary pairs, triadic triangles, and more.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["🎨 9 Levels", "🔺 Triadic", "⚡ Complementary", "🧠 Memory", "💡 RGB Lab"].map((tag, i) => (
            <div key={i} style={{
              padding: "5px 14px", borderRadius: 99,
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.20)",
              fontSize: 12, fontWeight: 700, color: "#4f46e5",
              animation: `fadeIn 0.5s ease ${i * 0.07}s both`,
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={onEnter}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="anim-pulse"
          style={{
            background: "linear-gradient(135deg,#6366F1,#7C8CFF)",
            color: "white",
            fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 21,
            padding: "16px 60px",
            borderRadius: 99, cursor: "pointer",
            boxShadow: hovered
              ? "0 14px 44px rgba(99,102,241,0.52)"
              : "0 8px 32px rgba(99,102,241,0.40)",
            transform: hovered ? "scale(1.05) translateY(-2px)" : "scale(1)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            border: "none",
          }}
        >
          Start Learning ✦
        </button>

        <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
          No account needed · Easy &amp; Hard modes
        </p>
      </div>
    </div>
  );
}
