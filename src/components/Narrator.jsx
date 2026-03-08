import React from "react";

export default function Narrator({ title, text, hint }) {
  return (
    <div className="glass-card" style={{
      padding: "16px 20px",
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
    }}>
      {/* Owl avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, #6366F1, #7C8CFF)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
        boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
      }}>
        🦉
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: 15,
          color: "#6366F1",
          marginBottom: 4, letterSpacing: "0.02em",
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 13.5, color: "#374151",
          lineHeight: 1.65,
          marginBottom: hint ? 8 : 0,
        }}>
          {text}
        </div>
        {hint && (
          <div style={{
            fontSize: 12.5, color: "#6366F1",
            borderLeft: "3px solid #6366F1",
            paddingLeft: 10, fontStyle: "italic", lineHeight: 1.5,
            background: "rgba(99,102,241,0.05)",
            borderRadius: "0 8px 8px 0",
            padding: "4px 10px",
          }}>
            💡 {hint}
          </div>
        )}
      </div>
    </div>
  );
}
