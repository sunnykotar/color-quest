import React, { useState, useEffect, useRef } from "react";
import TimerBar from "./TimerBar.jsx";

/**
 * LevelWrapper — three-phase wrapper for every level.
 *
 * "intro"     → centred glass instruction card spanning both grid columns
 * "countdown" → 3-2-1-GO! animation spanning both columns
 * "playing"   → renders children (which put their own content into columns)
 *               with an optional TimerBar above the right column
 */
export default function LevelWrapper({
  icon         = "🎨",
  title        = "",
  description  = "",
  bullets      = [],
  timerSecs    = 0,
  timerKey     = 0,
  onTimerExpire,
  hardMode     = false,
  showTimer    = true,
  children,
}) {
  const [phase, setPhase] = useState("intro");
  const [count, setCount] = useState(3);
  const ivRef = useRef(null);

  const beginCountdown = () => {
    setPhase("countdown"); setCount(3);
    let n = 3;
    ivRef.current = setInterval(() => {
      n--;
      if (n <= 0) { clearInterval(ivRef.current); setPhase("playing"); }
      else setCount(n);
    }, 800);
  };

  useEffect(() => () => clearInterval(ivRef.current), []);

  /* ── Intro: spans both grid columns via fixed overlay ─────────────── */
  if (phase === "intro") return (
    /* Full-screen overlay sits on top of the animated bg */
    <div className="anim-fade" style={{
      position:"fixed", inset:0, zIndex:50,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
      /* slight frosted tint so the bg is still visible behind */
      background:"rgba(238,246,255,0.25)",
      backdropFilter:"blur(2px)",
    }}>
      <div style={{
        background:"rgba(255,255,255,0.97)",
        backdropFilter:"blur(16px)",
        WebkitBackdropFilter:"blur(16px)",
        border:"1.5px solid rgba(79,123,255,0.18)",
        borderRadius:28,
        boxShadow:"0 20px 60px rgba(0,0,0,0.12)",
        padding:"clamp(24px, 5vw, 40px) clamp(20px, 6vw, 52px)",
        maxWidth:520, width:"100%",
        display:"flex", flexDirection:"column", alignItems:"center", gap:20, textAlign:"center",
      }}>
        <div style={{ fontSize:56 }}>{icon}</div>

        {hardMode && (
          <div style={{
            background:"linear-gradient(135deg,#ef4444,#f59e0b)",
            color:"white", borderRadius:99, padding:"4px 16px",
            fontSize:12, fontWeight:800, letterSpacing:"0.05em",
          }}>
            🔥 HARD MODE ACTIVE
          </div>
        )}

        <h2 style={{
          fontFamily:"var(--font-display)", fontSize:28, fontWeight:700, color:"var(--text)",
        }}>{title}</h2>
        <p style={{ fontSize:15, color:"var(--text-muted)", lineHeight:1.75, maxWidth:400 }}>
          {description}
        </p>

        {bullets.length > 0 && (
          <ul style={{
            listStyle:"none", width:"100%",
            display:"flex", flexDirection:"column", gap:9, textAlign:"left",
          }}>
            {bullets.map((b, i) => (
              <li key={i} style={{
                display:"flex", gap:10, alignItems:"flex-start",
                fontSize:14, color:"var(--text)", fontWeight:600,
              }}>
                <span style={{ color:"#4F7BFF", flexShrink:0, marginTop:2 }}>✦</span>
                {b}
              </li>
            ))}
          </ul>
        )}

        {timerSecs > 0 && (
          <div style={{
            background:"rgba(79,123,255,0.10)",
            border:"1px solid rgba(79,123,255,0.22)",
            borderRadius:12, padding:"10px 20px",
            fontSize:13, fontWeight:700, color:"#4F7BFF",
            display:"flex", gap:8, alignItems:"center",
          }}>
            ⏱ {timerSecs}s per challenge · −10 pts if time runs out
          </div>
        )}

        <button
          onClick={beginCountdown}
          style={{
            background:"linear-gradient(135deg, #4F7BFF, #6366F1)", color:"white",
            fontFamily:"var(--font-display)", fontWeight:700, fontSize:19,
            padding:"14px clamp(24px, 8vw, 52px)", borderRadius:99, cursor:"pointer",
            boxShadow:"0 8px 28px rgba(79,123,255,0.42)",
            transition:"transform 0.15s, box-shadow 0.15s",
            width:"100%", maxWidth:320,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.05)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(79,123,255,0.52)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.boxShadow="0 8px 28px rgba(79,123,255,0.42)"; }}
        >
          Start Level →
        </button>
      </div>
    </div>
  );

  /* ── Countdown: same full-screen overlay ───────────────────────────── */
  if (phase === "countdown") {
    const label = count > 0 ? String(count) : "GO!";
    const col   = count === 3 ? "#4F7BFF" : count === 2 ? "#f59e0b" : "#ef4444";
    return (
      <div style={{
        position:"fixed", inset:0, zIndex:50,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", gap:16,
        background:"rgba(238,246,255,0.25)",
        backdropFilter:"blur(2px)",
      }}>
        <div key={label} className="anim-count" style={{
          fontFamily:"var(--font-display)", fontSize:140, fontWeight:700, lineHeight:1,
          color:col,
          textShadow:`0 6px 40px ${col}66, 0 0 80px ${col}33`,
          userSelect:"none",
        }}>{label}</div>
        <div style={{
          fontSize:16, fontWeight:700,
          color:"rgba(30,27,75,0.75)",
          letterSpacing:"0.04em",
        }}>Get ready…</div>
      </div>
    );
  }

  /* ── Playing: fill the entire .app-root area ─────────────────────── */
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", minHeight:0 }}>
      {timerSecs > 0 && showTimer && (
        <div style={{
          position: "fixed",
          top: 52,
          left: 0,
          right: 0,
          padding: "6px 20px 0",
          zIndex: 90,
          pointerEvents: "none",
        }}>
          <TimerBar key={timerKey} seconds={timerSecs} onExpire={onTimerExpire} />
        </div>
      )}
      {children}
    </div>
  );
}
