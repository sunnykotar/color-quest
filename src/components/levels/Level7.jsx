/**
 * Level7 — Fix the Broken Palette
 *
 * Show a palette with one rogue color. Player clicks the odd-one-out.
 * +20 correct, -5 wrong. 7 rounds.
 */
import React, { useState } from "react";
import GameLayout   from "../GameLayout.jsx";
import LevelWrapper from "../LevelWrapper.jsx";

/* ── Round data ─────────────────────────────────────────────────────── */
/* Each round: an analogous trio with one swapped-in impostor */
const ROUNDS = [
  {
    scheme:"Analogous",
    swatches:[
      { hue:220, name:"Blue",       correct:true  },
      { hue:165, name:"Blue-Green", correct:true  },
      { hue:0,   name:"Red",        correct:false },   // ← impostor
    ],
    badName:"Red",
    fix:{ hue:90, name:"Yellow-Green" },
    explanation:"Red doesn't belong in a Blue → Blue-Green → Yellow-Green analogous run.",
  },
  {
    scheme:"Complementary",
    swatches:[
      { hue:0,   name:"Red",        correct:true  },
      { hue:165, name:"Blue-Green", correct:true  },
      { hue:60,  name:"Yellow",     correct:false },   // ← impostor
    ],
    badName:"Yellow",
    fix:null,
    explanation:"Complementary means just two opposite colors. Yellow is the extra one.",
  },
  {
    scheme:"Analogous",
    swatches:[
      { hue:270, name:"Violet",     correct:true  },
      { hue:248, name:"Blue-Violet",correct:true  },
      { hue:60,  name:"Yellow",     correct:false },   // ← impostor
    ],
    badName:"Yellow",
    fix:{ hue:305, name:"Red-Violet" },
    explanation:"Yellow jumps way across the wheel — it breaks the violet-blue run.",
  },
  {
    scheme:"Triadic",
    swatches:[
      { hue:0,   name:"Red",   correct:true  },
      { hue:220, name:"Blue",  correct:true  },
      { hue:38,  name:"Orange",correct:false },   // ← impostor (should be Yellow)
    ],
    badName:"Orange",
    fix:{ hue:60, name:"Yellow" },
    explanation:"The triadic partner of Red and Blue is Yellow (120° apart), not Orange.",
  },
  {
    scheme:"Monochromatic",
    swatches:[
      { hue:0, name:"Light Red", L:78, correct:true  },
      { hue:0, name:"Red",       L:55, correct:true  },
      { hue:220,name:"Blue",     L:55, correct:false },  // ← impostor (wrong hue)
    ],
    badName:"Blue",
    fix:{ hue:0, name:"Dark Red", L:30 },
    explanation:"Monochromatic uses one hue only. Blue is a completely different hue.",
  },
  {
    scheme:"Analogous",
    swatches:[
      { hue:38,  name:"Orange",       correct:true  },
      { hue:60,  name:"Yellow",       correct:true  },
      { hue:270, name:"Violet",       correct:false },  // ← impostor
    ],
    badName:"Violet",
    fix:{ hue:90, name:"Yellow-Green" },
    explanation:"Violet is on the opposite side of the wheel from orange and yellow.",
  },
  {
    scheme:"Triadic",
    swatches:[
      { hue:270, name:"Violet",    correct:true  },
      { hue:38,  name:"Orange",    correct:true  },
      { hue:220, name:"Blue",      correct:false },  // ← impostor (should be Blue-Green ~165)
    ],
    badName:"Blue",
    fix:{ hue:165, name:"Blue-Green" },
    explanation:"The triadic partner of Violet and Orange is Blue-Green (~165°), not Blue.",
  },
];

function SwatchCard({ hue, L = 55, name, onClick, state, disabled }) {
  const border =
    state === "wrong"   ? "3px solid #ef4444" :
    state === "correct" ? "3px solid #10b981" :
    "2.5px solid rgba(255,255,255,0.55)";
  const cursor = disabled ? "default" : "pointer";
  const scale  = state ? "scale(1.06)" : "scale(1)";

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor }}
    >
      <div style={{
        width:80, height:80, borderRadius:18,
        background:`hsl(${hue}, 80%, ${L}%)`,
        border,
        boxShadow:`0 4px 20px hsla(${hue},70%,${L}%,0.45)`,
        transform: scale,
        transition:"transform 0.18s, border 0.18s, box-shadow 0.18s",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: state ? 28 : 0,
      }}>
        {state === "wrong" ? "❌" : state === "correct" ? "✅" : ""}
      </div>
      <span style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textAlign:"center" }}>{name}</span>
    </div>
  );
}

export default function Level7({ onComplete, addPoints }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [picked,   setPicked]   = useState(null);   // index of clicked swatch
  const [result,   setResult]   = useState(null);   // "correct" | "wrong"
  const [correct,  setCorrect]  = useState(0);

  const round = ROUNDS[roundIdx];
  const total = ROUNDS.length;

  const handlePick = (i) => {
    if (result) return;
    const sw = round.swatches[i];
    const isRight = !sw.correct;   // correct answer = clicking the impostor
    setPicked(i);
    setResult(isRight ? "correct" : "wrong");
    addPoints(isRight ? 20 : -5);
    if (isRight) setCorrect(c => c + 1);
  };

  const handleNext = () => {
    if (roundIdx + 1 >= total) { onComplete(); return; }
    setRoundIdx(i => i + 1);
    setPicked(null); setResult(null);
  };

  const sidebar = (
    <>
      {/* Progress */}
      <div style={{ display:"flex", gap:5 }}>
        {ROUNDS.map((_, i) => (
          <div key={i} style={{
            height:5, flex:1, borderRadius:99,
            background: i < roundIdx ? "#6366F1"
                      : i === roundIdx ? (result === "correct" ? "#10b981" : result === "wrong" ? "#ef4444" : "#f59e0b")
                      : "rgba(255,255,255,0.40)",
            transition:"background 0.3s",
          }} />
        ))}
      </div>
      <div style={{ fontSize:12, color:"var(--text-muted)", fontWeight:700, textAlign:"right" }}>
        Round {roundIdx + 1} / {total}
      </div>

      {/* Scheme badge */}
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        background:"rgba(255,255,255,0.60)", backdropFilter:"blur(8px)",
        borderRadius:12, padding:"10px 14px",
        border:"1.5px solid rgba(255,255,255,0.55)",
      }}>
        <span style={{ fontSize:20 }}>🎨</span>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase" }}>Intended Scheme</div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:700, color:"#6366F1" }}>{round.scheme}</div>
        </div>
      </div>

      {/* Explanation */}
      {result && (
        <div className="anim-pop" style={{
          padding:"12px 16px", borderRadius:14,
          background: result === "correct" ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)",
          border:`1px solid ${result === "correct" ? "rgba(16,185,129,0.30)" : "rgba(239,68,68,0.30)"}`,
          fontSize:13, fontWeight:600, lineHeight:1.6,
        }}>
          {result === "correct" ? "✅ " : "❌ "}{round.explanation}
          {round.fix && result === "correct" && (
            <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:11, color:"var(--text-muted)" }}>Replaced with:</span>
              <div style={{
                width:22, height:22, borderRadius:6,
                background:`hsl(${round.fix.hue},80%,${round.fix.L ?? 55}%)`,
                border:"1px solid rgba(255,255,255,0.5)",
              }} />
              <span style={{ fontSize:12, fontWeight:700, color:"#6366F1" }}>{round.fix.name}</span>
            </div>
          )}
        </div>
      )}

      {result && (
        <button className="anim-pop" onClick={handleNext} style={{
          background:"linear-gradient(135deg,#6366F1,#7C8CFF)", color:"white",
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
      icon="🔧"
      title="Fix the Broken Palette"
      description="Each palette has one color that doesn't belong. Click the impostor to fix the palette!"
      bullets={[
        "Identify which color breaks the scheme",
        "Click it to remove the impostor",
        "+20 for finding it · −5 if you miss",
      ]}
    >
      <GameLayout
        narratorTitle="Fix the Broken Palette"
        narratorText={
          result
            ? round.explanation
            : `This should be a ${round.scheme} palette — but one color doesn't fit. Which one breaks it?`
        }
        narratorHint={!result ? "Click the color that doesn't belong." : null}
        sidebarBottom={sidebar}
      >
        <div style={{
          display:"flex", flexDirection:"column",
          alignItems:"center", gap:36, padding:"20px 0",
        }}>
          {/* Question label */}
          <div style={{
            fontFamily:"var(--font-display)", fontSize:20, fontWeight:700,
            color:"var(--text)", textAlign:"center",
            background:"rgba(255,255,255,0.60)", backdropFilter:"blur(8px)",
            padding:"10px 28px", borderRadius:99,
            border:"1.5px solid rgba(255,255,255,0.55)",
          }}>
            Which color breaks the palette? 🧩
          </div>

          {/* Swatch row */}
          <div style={{ display:"flex", gap:24, alignItems:"flex-end" }}>
            {round.swatches.map((sw, i) => (
              <SwatchCard
                key={`${roundIdx}-${i}`}
                hue={sw.hue} L={sw.L ?? 55} name={sw.name}
                onClick={() => handlePick(i)}
                disabled={!!result}
                state={
                  picked === i && result === "correct" && !sw.correct ? "wrong"   :
                  picked === i && result === "wrong"                  ? "correct"  :
                  result && !sw.correct                               ? "wrong"    :
                  null
                }
              />
            ))}
          </div>

          {/* Fixed palette preview */}
          {result === "correct" && round.fix && (
            <div className="anim-fade" style={{ textAlign:"center" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                ✨ Fixed Palette
              </div>
              <div style={{ display:"flex", gap:16, alignItems:"center", justifyContent:"center" }}>
                {round.swatches.filter(s => s.correct).map((sw, i) => (
                  <div key={i} style={{
                    width:52, height:52, borderRadius:12,
                    background:`hsl(${sw.hue},80%,${sw.L ?? 55}%)`,
                    border:"2px solid rgba(255,255,255,0.6)",
                    boxShadow:`0 3px 12px hsla(${sw.hue},70%,${sw.L ?? 55}%,0.4)`,
                  }} />
                ))}
                <div style={{
                  width:52, height:52, borderRadius:12,
                  background:`hsl(${round.fix.hue},80%,${round.fix.L ?? 55}%)`,
                  border:"2px solid rgba(255,255,255,0.6)",
                  boxShadow:`0 3px 12px hsla(${round.fix.hue},70%,${round.fix.L ?? 55}%,0.4)`,
                }} />
              </div>
            </div>
          )}
        </div>
      </GameLayout>
    </LevelWrapper>
  );
}
