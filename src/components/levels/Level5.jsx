/**
 * Level5 — RGB Light Lab (Progressive Multi-Challenge)
 *
 * Normal mode: 5 progressive color targets using RGB sliders.
 *   Player adjusts R/G/B sliders, a live swatch shows the mixed color.
 *   When Δ < 20 from target, show success and unlock "Next".
 *   +30 pts per correct mix. Bonus +10 for very close match (Δ < 8).
 *
 * Hard mode: same 5 targets but Δ must be < 12 (tighter tolerance).
 *   +40 pts per correct mix.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import GameLayout   from "../GameLayout.jsx";
import LevelWrapper from "../LevelWrapper.jsx";

/* ── Challenge data ─────────────────────────────────────────────────── */
const CHALLENGES = [
  {
    label: "Yellow",
    emoji: "🌟",
    target: { r:255, g:255, b:0 },
    hint: "Red + Green light makes Yellow",
    fact: "Yellow light = R + G. Blue = 0.",
  },
  {
    label: "Cyan",
    emoji: "🩵",
    target: { r:0, g:255, b:255 },
    hint: "Green + Blue light makes Cyan",
    fact: "Cyan = G + B. Red = 0.",
  },
  {
    label: "Magenta",
    emoji: "💜",
    target: { r:255, g:0, b:255 },
    hint: "Red + Blue light makes Magenta",
    fact: "Magenta = R + B. Green = 0.",
  },
  {
    label: "Orange",
    emoji: "🍊",
    target: { r:255, g:165, b:0 },
    hint: "Lots of Red, some Green, no Blue",
    fact: "Orange = high R, medium G, zero B.",
  },
  {
    label: "Purple",
    emoji: "🔮",
    target: { r:128, g:0, b:128 },
    hint: "Equal Red and Blue, no Green",
    fact: "Purple = medium R + medium B. G = 0.",
  },
];

const TOTAL = CHALLENGES.length;

function colorDelta(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

function SliderRow({ val, set, label, col, trackGrad }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:13, fontWeight:800, color:col }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color:"var(--text-muted)" }}>{val}</span>
      </div>
      <input
        type="range" min={0} max={255} value={val}
        onChange={e => set(Number(e.target.value))}
        style={{ width:"100%", background:trackGrad }}
      />
    </div>
  );
}

export default function Level5({ onComplete, addPoints, hardMode = false }) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const [awarded, setAwarded]   = useState(false);
  const [delta,   setDelta]     = useState(999);
  const [success, setSuccess]   = useState(false);

  const stageRef = useRef(null);
  const [dims, setDims] = useState({ w:0, h:0 });

  const measure = useCallback(() => {
    if (stageRef.current) {
      const { width, height } = stageRef.current.getBoundingClientRect();
      setDims({ w:width, h:height });
    }
  }, []);

  useEffect(() => { measure(); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, [measure]);

  const challenge = CHALLENGES[challengeIdx];
  const { target } = challenge;

  // Recompute delta whenever sliders move
  useEffect(() => {
    const d = colorDelta(r, g, b, target.r, target.g, target.b);
    setDelta(Math.round(d));
    const threshold = hardMode ? 12 : 20;
    if (d < threshold && !awarded) {
      const pts = hardMode ? 40 : (d < 8 ? 40 : 30);
      addPoints(pts);
      setAwarded(true);
      setSuccess(true);
    }
  }, [r, g, b]);

  const handleNext = () => {
    if (challengeIdx + 1 >= TOTAL) {
      onComplete();
      return;
    }
    setChallengeIdx(i => i + 1);
    setR(0); setG(0); setB(0);
    setAwarded(false); setSuccess(false); setDelta(999);
  };

  // Live light-mixing backdrop (dark stage with 3 coloured glows)
  const lightBg = (() => {
    if (dims.w === 0) return "#0a0a14";
    const cx  = dims.w / 2,   cy  = dims.h / 2;
    const off = Math.min(dims.w, dims.h) * 0.26;
    const rad = Math.min(dims.w, dims.h) * 0.60;
    const ra  = (r / 255).toFixed(3);
    const ga  = (g / 255).toFixed(3);
    const ba  = (b / 255).toFixed(3);
    return [
      `radial-gradient(circle ${rad}px at ${cx - off}px ${cy - off * 0.7}px, rgba(255,0,0,${ra}) 0%, transparent 70%)`,
      `radial-gradient(circle ${rad}px at ${cx + off}px ${cy - off * 0.7}px, rgba(0,210,0,${ga}) 0%, transparent 70%)`,
      `radial-gradient(circle ${rad}px at ${cx}px ${cy + off}px,            rgba(0,60,255,${ba})  0%, transparent 70%)`,
      "#0a0a14",
    ].join(", ");
  })();

  // Accuracy bar fill (inverted delta: closer = fuller)
  const maxDelta  = Math.sqrt(3) * 255;
  const pctClose  = Math.max(0, Math.round((1 - delta / maxDelta) * 100));
  const threshold = hardMode ? 12 : 20;
  const isClose   = delta < threshold * 2.5;

  const sidebar = (
    <>
      {/* ── Target swatch ── */}
      <div style={{
        background:"rgba(238,242,255,0.8)", borderRadius:14,
        padding:"12px 16px", border:"1px solid rgba(215,224,255,0.7)",
      }}>
        <div style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
          Target Color
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Target swatch */}
          <div style={{
            width:52, height:52, borderRadius:12, flexShrink:0,
            background:`rgb(${target.r},${target.g},${target.b})`,
            boxShadow:`0 4px 16px rgba(${target.r},${target.g},${target.b},0.45)`,
            border:"2px solid rgba(255,255,255,0.7)",
          }} />
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700 }}>
              {challenge.emoji} {challenge.label}
            </div>
            <div style={{ fontSize:12, color:"var(--text-muted)", fontWeight:600, marginTop:2 }}>
              {challenge.hint}
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display:"flex", gap:5, marginTop:10 }}>
          {CHALLENGES.map((_, i) => (
            <div key={i} style={{
              height:5, flex:1, borderRadius:99,
              background: i < challengeIdx  ? "#6366F1"
                        : i === challengeIdx ? (success ? "#10b981" : "#f59e0b")
                        : "rgba(215,224,255,0.5)",
              transition:"background 0.3s",
            }} />
          ))}
        </div>
        <div style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600, marginTop:4, textAlign:"right" }}>
          {challengeIdx + 1} / {TOTAL}
        </div>
      </div>

      {/* ── Your mix swatch + accuracy ── */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{
          width:44, height:44, borderRadius:10, flexShrink:0,
          background:`rgb(${r},${g},${b})`,
          border:"2px solid rgba(215,224,255,0.6)",
          boxShadow:`0 2px 10px rgba(${r},${g},${b},0.35)`,
          transition:"background 0.08s",
        }} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", marginBottom:4 }}>
            YOUR MIX  <span style={{ color: isClose ? "#10b981" : "var(--text-muted)" }}>Δ {delta}</span>
          </div>
          {/* Accuracy bar */}
          <div style={{ height:8, borderRadius:99, background:"rgba(215,224,255,0.4)", overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:99,
              width:`${pctClose}%`,
              background: success ? "linear-gradient(90deg,#10b981,#34d399)"
                        : isClose  ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                        :            "linear-gradient(90deg,#6366F1,#a5b4fc)",
              transition:"width 0.1s ease, background 0.3s",
            }} />
          </div>
        </div>
      </div>

      {/* ── Sliders ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <SliderRow val={r} set={setR} label="Red"   col="#ef4444" trackGrad="linear-gradient(to right,#1a0a0a,#ff0000)" />
        <SliderRow val={g} set={setG} label="Green" col="#10b981" trackGrad="linear-gradient(to right,#0a1a0a,#00cc44)" />
        <SliderRow val={b} set={setB} label="Blue"  col="#6366F1" trackGrad="linear-gradient(to right,#0a0a1a,#0055ff)" />
      </div>

      {/* ── Success banner ── */}
      {success && (
        <div className="anim-pop" style={{
          textAlign:"center", color:"#10b981", fontWeight:700, fontSize:14,
          padding:"10px 14px", background:"rgba(16,185,129,0.10)",
          borderRadius:12, border:"1px solid rgba(16,185,129,0.25)",
        }}>
          🎉 Great! You mixed {challenge.label}!{" "}
          <span style={{ color:"#6366F1" }}>+{hardMode ? 40 : delta < 8 ? 40 : 30} pts</span>
        </div>
      )}
      {success && (
        <div style={{ fontSize:12, color:"var(--text-muted)", textAlign:"center", fontStyle:"italic" }}>
          {challenge.fact}
        </div>
      )}

      {success && (
        <button className="anim-pop" onClick={handleNext} style={{
          background:"linear-gradient(135deg,#6366F1,#7C8CFF)", color:"white",
          fontFamily:"var(--font-display)", fontWeight:700, fontSize:17,
          padding:"13px 0", borderRadius:14,
          boxShadow:"0 6px 24px rgba(99,102,241,0.35)", width:"100%",
        }}>
          {challengeIdx + 1 < TOTAL ? `Next Color (${challengeIdx + 2}/${TOTAL}) →` : "Finish! 🎉"}
        </button>
      )}
    </>
  );

  return (
    <LevelWrapper
      icon="💡"
      title="RGB Light Lab"
      hardMode={hardMode}
      description={`Mix Red, Green, and Blue light to match ${TOTAL} target colors. Unlike paint, light adds brightness when combined!`}
      bullets={[
        "Adjust the R, G, B sliders to mix colors",
        `Match the target color (within ${hardMode ? "12" : "20"} units)`,
        "R+G = Yellow · G+B = Cyan · R+B = Magenta",
        "+30 pts per match (bonus +10 for exact match)",
      ]}
    >
      <GameLayout
        narratorTitle="RGB Light Mixing"
        narratorText={
          success
            ? challenge.fact
            : "Screens mix Red, Green, and Blue light. Unlike paint, mixing more light makes it brighter. All three at full = White!"
        }
        narratorHint={!success ? challenge.hint : null}
        sidebarBottom={sidebar}
      >
        {/* ── Dark light-mixing stage ── */}
        <div
          ref={stageRef}
          style={{
            width:400, height:400, borderRadius:24,
            background:lightBg,
            border:"1px solid rgba(255,255,255,0.10)",
            position:"relative", overflow:"hidden",
            boxShadow:"0 8px 40px rgba(0,0,0,0.30)",
            transition:"background 0.08s",
          }}
        >
          {/* Mixed colour result orb */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            width:80, height:80, borderRadius:"50%",
            background:`rgb(${r},${g},${b})`,
            border: success
              ? "3px solid rgba(255,255,255,0.95)"
              : "2px solid rgba(255,255,255,0.18)",
            boxShadow: success
              ? `0 0 0 10px rgba(255,255,255,0.12), 0 0 60px 20px rgba(${r},${g},${b},0.6)`
              : `0 0 24px rgba(${r},${g},${b},0.55)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize: success ? 32 : 0,
            transition:"all 0.15s",
            zIndex:2,
          }}>
            {success ? "✨" : ""}
          </div>

          {/* rgb readout */}
          <div style={{
            position:"absolute", top:10, right:12, zIndex:3,
            fontSize:10, color:"rgba(255,255,255,0.40)",
            fontFamily:"monospace",
            background:"rgba(0,0,0,0.50)", padding:"3px 8px", borderRadius:6,
          }}>
            rgb({r},{g},{b})
          </div>

          {/* Target readout */}
          <div style={{
            position:"absolute", bottom:12, left:"50%",
            transform:"translateX(-50%)",
            background:"rgba(0,0,0,0.65)", padding:"4px 16px",
            borderRadius:99, fontSize:13, fontWeight:700,
            whiteSpace:"nowrap", zIndex:3,
            color: success ? "#34d399" : "rgba(255,255,255,0.70)",
          }}>
            {success ? `✓ ${challenge.label} matched!` : `Target: ${challenge.label}`}
          </div>

          {/* Light source labels */}
          {dims.w > 0 && (() => {
            const cx=dims.w/2, cy=dims.h/2, off=Math.min(dims.w,dims.h)*0.26;
            return [
              { l:"R", x:cx-off, y:cy-off*0.7, c:"#ff6666" },
              { l:"G", x:cx+off, y:cy-off*0.7, c:"#44ee66" },
              { l:"B", x:cx,     y:cy+off,      c:"#7799ff" },
            ].map(({ l, x, y, c }) => (
              <div key={l} style={{
                position:"absolute", left:x, top:y,
                transform:"translate(-50%,-50%)",
                fontSize:14, fontWeight:900, color:c,
                textShadow:`0 0 10px ${c}`,
                opacity:0.55, pointerEvents:"none", zIndex:1,
              }}>{l}</div>
            ));
          })()}
        </div>
      </GameLayout>
    </LevelWrapper>
  );
}
