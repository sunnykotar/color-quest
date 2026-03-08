import React from "react";

export default function StreakBadge({ streak }) {
  if (streak < 2) return null;
  const bonus = streak >= 5 ? "+25 bonus!" : streak >= 3 ? "+10 bonus!" : "";
  return (
    <div
      key={streak}   // re-mount triggers anim-streak each time streak changes
      className="anim-streak"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: streak >= 5
          ? "linear-gradient(135deg, #f59e0b, #ef4444)"
          : "linear-gradient(135deg, #f59e0b, #fbbf24)",
        color: "white",
        padding: "5px 14px", borderRadius: 99,
        fontWeight: 800, fontSize: 13,
        boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
        flexShrink: 0,
      }}
    >
      🔥 {streak} streak{bonus ? `  ${bonus}` : ""}
    </div>
  );
}
