import React from "react";

const RANKS = [
  { min: 0,   label: "Color Rookie",     icon: "🌱", color: "#6b7280" },
  { min: 60,  label: "Color Apprentice", icon: "🎨", color: "#4F7BFF" },
  { min: 75,  label: "Color Artist",     icon: "🌟", color: "#f59e0b" },
  { min: 90,  label: "Color Master",     icon: "👑", color: "#ef4444" },
];

export function getRank(accuracy) {
  return [...RANKS].reverse().find(r => accuracy >= r.min) || RANKS[0];
}

/**
 * StatsOverlay — shown when a level ends before proceeding.
 * Props: correct, total, avgTime (seconds), onContinue
 */
export default function StatsOverlay({ correct, total, avgTime, onContinue }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const rank     = getRank(accuracy);

  return (
    <div className="anim-pop" style={{
      position: "absolute", inset: 0, zIndex: 40,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(238,246,255,0.92)",
      backdropFilter: "blur(8px)",
      borderRadius: 20,
    }}>
      <div style={{
        background: "white",
        border: "2px solid var(--border)",
        borderRadius: 20,
        padding: "32px 36px",
        textAlign: "center",
        boxShadow: "var(--shadow-lg)",
        minWidth: 280,
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        <div style={{ fontSize: 52 }}>{rank.icon}</div>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
          color: rank.color,
        }}>
          {rank.label}
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Stat label="Accuracy" value={`${accuracy}%`} color={rank.color} />
          {avgTime > 0 && <Stat label="Avg Time" value={`${avgTime.toFixed(1)}s`} color="#4F7BFF" />}
          <Stat label="Correct" value={`${correct}/${total}`} color="#10b981" />
        </div>

        <button onClick={onContinue} style={{
          background: "linear-gradient(135deg, #4F7BFF, #6366F1)",
          color: "white", fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: 16, padding: "12px 0",
          borderRadius: 12, boxShadow: "0 4px 16px rgba(79,123,255,0.35)",
          width: "100%",
        }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{
      background: "var(--surface2)", borderRadius: 12,
      padding: "10px 16px", textAlign: "center",
      border: "1px solid var(--border)",
    }}>
      <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22,
        fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  );
}
