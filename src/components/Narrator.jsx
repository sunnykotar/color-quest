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
        background: "linear-gradient(135deg, #4F7BFF, #6366F1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
        boxShadow: "0 4px 14px rgba(79,123,255,0.35)",
      }}>
        🦉
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: 15,
          color: "#4F7BFF",
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
            fontSize: 12.5, color: "#4F7BFF",
            borderLeft: "3px solid #06B6D4",
            paddingLeft: 10, fontStyle: "italic", lineHeight: 1.5,
            background: "rgba(6,182,212,0.07)",
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
