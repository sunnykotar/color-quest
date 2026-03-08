/**
 * Level6 — Color Scheme Detective  (Bloom: Understand + Explain)
 *
 * Show a swatch palette → player identifies the color scheme.
 * 8 rounds. +25 correct, -5 wrong.
 */
import React, { useState } from "react";
import GameLayout   from "../GameLayout.jsx";
import LevelWrapper from "../LevelWrapper.jsx";

/* ── Palette data ─────────────────────────────────────────────────── */
const ROUNDS = [
  {
    label: "Analogous",
    swatches: [{ hue:220, name:"Blue" }, { hue:165, name:"Blue-Green" }, { hue:90, name:"Yellow-Green" }],
    explanation: "These three colors sit side-by-side on the wheel — that's analogous!",
  },
  {
    label: "Complementary",
    swatches: [{ hue:0, name:"Red" }, { hue:165, name:"Blue-Green" }],
    explanation: "Red and Blue-Green sit directly opposite each other — complementary pairs!",
  },
  {
    label: "Triadic",
    swatches: [{ hue:0, name:"Red" }, { hue:220, name:"Blue" }, { hue:60, name:"Yellow" }],
    explanation: "Red, Blue, Yellow are evenly spaced at 120° — a classic triadic scheme!",
  },
  {
    label: "Monochromatic",
    swatches: [
      { hue:220, name:"Light Blue", L:75 },
      { hue:220, name:"Blue",       L:55 },
      { hue:220, name:"Dark Blue",  L:30 },
    ],
    explanation: "Same hue, different lightness — that's monochromatic.",
  },
  {
    label: "Analogous",
    swatches: [{ hue:0, name:"Red" }, { hue:20, name:"Red-Orange" }, { hue:38, name:"Orange" }],
    explanation: "Red, Red-Orange, and Orange are neighbors — analogous warm tones!",
  },
  {
    label: "Complementary",
    swatches: [{ hue:60, name:"Yellow" }, { hue:270, name:"Violet" }],
    explanation: "Yellow and Violet oppose each other perfectly on the wheel.",
  },
  {
    label: "Triadic",
    swatches: [{ hue:270, name:"Violet" }, { hue:38, name:"Orange" }, { hue:165, name:"Blue-Green" }],
    explanation: "Violet, Orange, and Blue-Green form an even triangle — triadic!",
  },
  {
    label: "Monochromatic",
    swatches: [
      { hue:0, name:"Pale Red",  L:80 },
      { hue:0, name:"Red",       L:55 },
      { hue:0, name:"Dark Red",  L:28 },
    ],
    explanation: "All one hue, just different shades — monochromatic.",
  },
];

const SCHEMES = ["Analogous", "Complementary", "Triadic", "Monochromatic"];
const SCHEME_META = {
  "Analogous":      { icon:"🌊", color:"#0ea5e9", desc:"Colors sitting next to each other on the wheel." },
  "Complementary":  { icon:"⚡", color:"#f59e0b", desc:"Colors directly opposite on the wheel." },
  "Triadic":        { icon:"🔺", color:"#10b981", desc:"Three colors evenly spaced (120° apart)." },
  "Monochromatic":  { icon:"🌑", color:"#8b5cf6", desc:"One hue in different shades and tints." },
};

function Swatch({ hue, L = 55, name }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{
        width:72, height:72, borderRadius:16,
        background: `hsl(${hue}, ${hue === 0 && L < 40 ? 65 : 80}%, ${L}%)`,
        boxShadow:`0 4px 18px hsla(${hue},70%,${L}%,0.4)`,
        border:"2.5px solid rgba(255,255,255,0.6)",
        flexShrink:0,
      }} />
      <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textAlign:"center" }}>{name}</span>
    </div>
  );
}

function AnswerBtn({ label, onClick, state }) {
  const meta = SCHEME_META[label];
  const bg =
    state === "correct" ? "linear-gradient(135deg,#10b981,#34d399)" :
    state === "wrong"   ? "linear-gradient(135deg,#ef4444,#f87171)" :
    "rgba(255,255,255,0.70)";
  const textCol = state ? "white" : "var(--text)";

  return (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:10,
      padding:"12px 16px", borderRadius:14,
      background: bg, border:"1.5px solid rgba(255,255,255,0.55)",
      backdropFilter:"blur(8px)",
      fontFamily:"var(--font-body)", fontWeight:700, fontSize:14,
      color: textCol, cursor:"pointer",
      boxShadow:"0 3px 12px rgba(0,0,0,0.07)",
      transition:"transform 0.12s, box-shadow 0.12s",
      width:"100%", textAlign:"left",
    }}
      onMouseEnter={e => { if (!state) { e.currentTarget.style.transform="scale(1.02)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.12)"; }}}
      onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,0.07)"; }}
    >
      <span style={{ fontSize:18 }}>{meta.icon}</span>
      <div>
        <div>{label}</div>
        <div style={{ fontSize:11, fontWeight:600, opacity:0.75, marginTop:1 }}>{meta.desc}</div>
      </div>
    </button>
  );
}

export default function Level6({ onComplete, addPoints }) {
  const [roundIdx,  setRoundIdx]  = useState(0);
  const [chosen,    setChosen]    = useState(null);   // null | "correct" | "wrong"
  const [chosenLbl, setChosenLbl] = useState(null);
  const [score,     setScore]     = useState(0);
  const [correct,   setCorrect]   = useState(0);

  const round = ROUNDS[roundIdx];
  const total = ROUNDS.length;
  const done  = roundIdx >= total;

  const handleAnswer = (scheme) => {
    if (chosen) return;
    const isRight = scheme === round.label;
    setChosenLbl(scheme);
    setChosen(isRight ? "correct" : "wrong");
    const pts = isRight ? 25 : -5;
    addPoints(pts);
    setScore(s => s + pts);
    if (isRight) setCorrect(c => c + 1);
  };

  const handleNext = () => {
    if (roundIdx + 1 >= total) { onComplete(); return; }
    setRoundIdx(i => i + 1);
    setChosen(null); setChosenLbl(null);
  };

  const sidebar = done ? null : (
    <>
      {/* Round counter */}
      <div style={{ display:"flex", gap:5 }}>
        {ROUNDS.map((_, i) => (
          <div key={i} style={{
            height:5, flex:1, borderRadius:99,
            background: i < roundIdx ? "#6366F1"
                      : i === roundIdx ? (chosen === "correct" ? "#10b981" : chosen === "wrong" ? "#ef4444" : "#f59e0b")
                      : "rgba(255,255,255,0.40)",
            transition:"background 0.3s",
          }} />
        ))}
      </div>
      <div style={{ fontSize:12, color:"var(--text-muted)", fontWeight:700, textAlign:"right" }}>
        Round {roundIdx + 1} / {total}
      </div>

      {/* Answer buttons */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {SCHEMES.map(s => (
          <AnswerBtn
            key={s} label={s}
            onClick={() => handleAnswer(s)}
            state={
              chosen && s === round.label   ? "correct" :
              chosen && s === chosenLbl     ? "wrong"   : null
            }
          />
        ))}
      </div>

      {/* Explanation */}
      {chosen && (
        <div className="anim-pop" style={{
          padding:"12px 16px", borderRadius:14,
          background: chosen === "correct" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.10)",
          border:`1px solid ${chosen === "correct" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
          fontSize:13, fontWeight:600, color:"var(--text)", lineHeight:1.6,
        }}>
          {chosen === "correct" ? "✅" : "❌"} {round.explanation}
        </div>
      )}

      {chosen && (
        <button className="anim-pop" onClick={handleNext} style={{
          background:"linear-gradient(135deg, #4F7BFF, #6366F1)", color:"white",
          fontFamily:"var(--font-display)", fontWeight:700, fontSize:17,
          padding:"13px 0", borderRadius:14, width:"100%",
          boxShadow:"0 6px 24px rgba(99,102,241,0.35)",
        }}>
          {roundIdx + 1 < total ? "Next Round →" : "Finish! 🎉"}
        </button>
      )}
    </>
  );

  return (
    <LevelWrapper
      icon="🕵️"
      title="Color Scheme Detective"
      description="Study each palette and identify which color scheme it represents. Use your color theory knowledge!"
      bullets={[
        "Analogous: neighbors on the wheel",
        "Complementary: opposites on the wheel",
        "Triadic: 3 colors, 120° apart",
        "Monochromatic: one hue, many shades",
        "+25 correct · −5 wrong",
      ]}
    >
      <GameLayout
        narratorTitle="Color Scheme Detective"
        narratorText={
          done
            ? `Well done! You identified ${correct}/${total} schemes correctly.`
            : chosen
              ? round.explanation
              : "Study the palette carefully. Which color scheme does it show?"
        }
        narratorHint={!chosen && !done ? "Look at the relationships between the colors." : null}
        sidebarBottom={sidebar}
      >
        {/* ── Palette display ── */}
        <div style={{
          display:"flex", flexDirection:"column", alignItems:"center",
          gap:32, padding:"24px 0",
        }}>
          {/* "What scheme is this?" prompt */}
          <div style={{
            fontFamily:"var(--font-display)", fontSize:20, fontWeight:700,
            color:"var(--text)", textAlign:"center",
            background:"rgba(255,255,255,0.60)", backdropFilter:"blur(8px)",
            padding:"10px 28px", borderRadius:99,
            border:"1.5px solid rgba(255,255,255,0.55)",
          }}>
            What color scheme is this? 🤔
          </div>

          {/* Swatches */}
          <div style={{ display:"flex", gap:20, alignItems:"flex-end" }}>
            {round.swatches.map((sw, i) => (
              <Swatch key={i} hue={sw.hue} L={sw.L ?? 55} name={sw.name} />
            ))}
          </div>

          {/* Reveal badge */}
          {chosen && (() => {
            const meta = SCHEME_META[round.label];
            return (
              <div className="anim-pop" style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"10px 24px", borderRadius:99,
                background:`${meta.color}22`,
                border:`2px solid ${meta.color}55`,
                fontFamily:"var(--font-display)", fontSize:18, fontWeight:700,
                color: meta.color,
              }}>
                {meta.icon} {round.label}
              </div>
            );
          })()}
        </div>
      </GameLayout>
    </LevelWrapper>
  );
}
