/**
 * Level8 — Color Memory Challenge
 *
 * Crystal-clear 6-step flow:
 *   1. FLASH   – show palette for 2 s with big countdown
 *   2. HIDE    – brief 400 ms blackout
 *   3. QUESTION– show 4 scheme buttons + hidden swatches
 *   4. ANSWER  – lock buttons, reveal correct, show feedback
 *   5. REVEAL  – re-show swatches so player sees what they were
 *   6. NEXT    – advance button
 *
 * Easy mode : no extra time pressure — player picks at their own pace.
 * Hard mode : 10 s question timer; expire = wrong answer.
 *
 * +25 correct · −5 wrong.  8 rounds.
 */
import React, { useState, useEffect, useRef } from "react";
import GameLayout   from "../GameLayout.jsx";
import LevelWrapper from "../LevelWrapper.jsx";

/* ── constants ─────────────────────────────────────────────────────── */
const SHOW_MS    = 2000;
const HIDE_MS    = 350;
const HARD_SECS  = 10;

const SCHEMES = ["Analogous", "Complementary", "Triadic", "Monochromatic"];

const SCHEME_META = {
  "Analogous":     { icon:"🌊", color:"#0ea5e9", desc:"Colors side-by-side on the wheel" },
  "Complementary": { icon:"⚡", color:"#f59e0b", desc:"Two colors directly opposite"      },
  "Triadic":       { icon:"🔺", color:"#10b981", desc:"Three colors, 120° apart"          },
  "Monochromatic": { icon:"🌑", color:"#8b5cf6", desc:"One hue, different shades"         },
};

const ROUNDS = [
  {
    label:"Triadic",
    swatches:[{hue:0,L:55},{hue:220,L:55},{hue:60,L:60}],
    names:["Red","Blue","Yellow"],
    explain:"Red, Blue, Yellow sit 120° apart — a classic triadic triangle!",
  },
  {
    label:"Analogous",
    swatches:[{hue:0,L:55},{hue:20,L:55},{hue:38,L:55}],
    names:["Red","Red-Orange","Orange"],
    explain:"Red → Red-Orange → Orange are warm neighbors — analogous!",
  },
  {
    label:"Complementary",
    swatches:[{hue:60,L:60},{hue:270,L:55}],
    names:["Yellow","Violet"],
    explain:"Yellow and Violet sit directly opposite each other.",
  },
  {
    label:"Monochromatic",
    swatches:[{hue:165,L:75},{hue:165,L:50},{hue:165,L:28}],
    names:["Light Teal","Teal","Dark Teal"],
    explain:"Same hue (Teal), but three different lightness values.",
  },
  {
    label:"Analogous",
    swatches:[{hue:220,L:55},{hue:248,L:55},{hue:270,L:55}],
    names:["Blue","Blue-Violet","Violet"],
    explain:"Blue → Blue-Violet → Violet are cool neighbors — analogous!",
  },
  {
    label:"Complementary",
    swatches:[{hue:0,L:55},{hue:165,L:55}],
    names:["Red","Blue-Green"],
    explain:"Red and Blue-Green are opposite on the color wheel.",
  },
  {
    label:"Triadic",
    swatches:[{hue:270,L:55},{hue:38,L:55},{hue:165,L:55}],
    names:["Violet","Orange","Blue-Green"],
    explain:"Violet, Orange, Blue-Green form a bold equilateral triangle!",
  },
  {
    label:"Monochromatic",
    swatches:[{hue:305,L:78},{hue:305,L:55},{hue:305,L:30}],
    names:["Pale Magenta","Magenta","Deep Magenta"],
    explain:"All three are Magenta — just lighter or darker.",
  },
];

/* ── sub-components ────────────────────────────────────────────────── */
function Swatch({ hue, L, visible, name, showName }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div style={{
        width:72, height:72, borderRadius:16,
        background: visible ? `hsl(${hue},82%,${L}%)` : "rgba(255,255,255,0.18)",
        border:"2.5px solid rgba(255,255,255,0.55)",
        boxShadow: visible ? `0 6px 24px hsla(${hue},70%,${L}%,0.50)` : "none",
        transform: visible ? "scale(1)" : "scale(0.88)",
        transition:"background 0.28s, transform 0.28s, box-shadow 0.28s",
      }} />
      <span style={{
        fontSize:11, fontWeight:700, color:"var(--text-muted)",
        opacity: showName ? 1 : 0, transition:"opacity 0.2s",
        textAlign:"center", minWidth:56,
      }}>
        {name}
      </span>
    </div>
  );
}

function SchemeBtn({ label, onClick, state, disabled }) {
  const meta = SCHEME_META[label];
  const bg =
    state === "correct" ? "linear-gradient(135deg,#10b981,#34d399)" :
    state === "wrong"   ? "linear-gradient(135deg,#ef4444,#f87171)" :
                          "rgba(255,255,255,0.97)";
  return (
    <button
      onClick={() => !disabled && onClick(label)}
      style={{
        display:"flex", alignItems:"center", gap:12,
        padding:"13px 18px", borderRadius:14, width:"100%", textAlign:"left",
        background:bg, border:`1.5px solid ${state ? "transparent" : "rgba(79,123,255,0.18)"}`,
        backdropFilter:"blur(10px)",
        fontFamily:"var(--font-body)", fontWeight:700, fontSize:15,
        color: state ? "white" : "var(--text)",
        cursor: disabled ? "default" : "pointer",
        boxShadow: state === "correct" ? "0 4px 18px rgba(16,185,129,0.35)"
                 : state === "wrong"   ? "0 4px 18px rgba(239,68,68,0.25)"
                 : "0 2px 12px rgba(79,123,255,0.10), 0 1px 3px rgba(0,0,0,0.05)",
        transition:"transform 0.12s, box-shadow 0.12s, background 0.12s",
        opacity: disabled && !state ? 0.7 : 1,
      }}
      onMouseEnter={e => { if (!disabled && !state) { e.currentTarget.style.transform="scale(1.02)"; e.currentTarget.style.background="rgba(240,235,255,0.97)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(99,102,241,0.18)"; }}}
      onMouseLeave={e => { if (!disabled && !state) { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.background="rgba(255,255,255,0.97)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(79,123,255,0.10)"; }}}
    >
      <span style={{ fontSize:22, flexShrink:0 }}>{meta.icon}</span>
      <div>
        <div>{label}</div>
        <div style={{ fontSize:11, fontWeight:600, opacity:0.72, marginTop:1 }}>{meta.desc}</div>
      </div>
      {state === "correct" && <span style={{ marginLeft:"auto", fontSize:18 }}>✓</span>}
      {state === "wrong"   && <span style={{ marginLeft:"auto", fontSize:18 }}>✗</span>}
    </button>
  );
}

/* ── main component ────────────────────────────────────────────────── */
export default function Level8({ onComplete, addPoints, hardMode = false }) {
  /* phase: "waiting" | "flash" | "hiding" | "question" | "answered"
     "waiting" = mounted but flash timer not yet started; swatches shown immediately */
  const [phase,    setPhase]    = useState("waiting");
  const [roundIdx, setRoundIdx] = useState(0);
  const [chosen,   setChosen]   = useState(null);
  const [result,   setResult]   = useState(null);   // "correct" | "wrong"
  const [correct,  setCorrect]  = useState(0);
  const [flashMs,  setFlashMs]  = useState(SHOW_MS); // ms remaining during flash

  /* hard-mode question timer */
  const [qSecs,   setQSecs]   = useState(HARD_SECS);
  const rafRef    = useRef(null);
  const startRef  = useRef(0);
  const qTimerRef = useRef(null);

  const round = ROUNDS[roundIdx];

  /* ── waiting → flash ─────────────────────────────────────────────── *
   * Round 0: wait 1200ms after mount so the "GO!" overlay fully clears
   *          before the 3s viewing window begins.
   * Round 1+: wait 500ms (player is already watching).
   * Total viewing time before flash: 3s either way.
   * ─────────────────────────────────────────────────────────────────── */
  const mountDelay = roundIdx === 0 ? 1200 : 500;
  useEffect(() => {
    if (phase !== "waiting") return;
    // First: wait for the "GO!" overlay to clear, then show colours
    // Second: after viewing window, kick off the flash countdown
    const t1 = setTimeout(() => {
      const t2 = setTimeout(() => setPhase("flash"), 3000);
      return () => clearTimeout(t2);
    }, mountDelay);
    return () => clearTimeout(t1);
  }, [phase, roundIdx]);

  /* ── flash countdown via rAF ─────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "flash") return;
    startRef.current = Date.now();
    setFlashMs(SHOW_MS);

    const tick = () => {
      const left = Math.max(0, SHOW_MS - (Date.now() - startRef.current));
      setFlashMs(left);
      if (left <= 0) {
        setPhase("hiding");
        setTimeout(() => setPhase("question"), HIDE_MS);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [phase, roundIdx]);

  /* ── hard-mode question timer ────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "question" || !hardMode) return;
    setQSecs(HARD_SECS);
    let remaining = HARD_SECS;
    qTimerRef.current = setInterval(() => {
      remaining -= 1;
      setQSecs(remaining);
      if (remaining <= 0) {
        clearInterval(qTimerRef.current);
        // time's up → auto-wrong
        handleAnswer("__timeout__");
      }
    }, 1000);
    return () => clearInterval(qTimerRef.current);
  }, [phase, roundIdx]);

  const handleAnswer = (scheme) => {
    clearInterval(qTimerRef.current);
    if (result) return;
    const isRight = scheme === round.label;
    setChosen(scheme);
    setResult(isRight ? "correct" : "wrong");
    addPoints(isRight ? 25 : -5);
    if (isRight) setCorrect(c => c + 1);
    setPhase("answered");
  };

  const handleNext = () => {
    if (roundIdx + 1 >= ROUNDS.length) { onComplete(); return; }
    setRoundIdx(i => i + 1);
    setChosen(null); setResult(null); setFlashMs(SHOW_MS); setPhase("waiting");
  };

  /* ── derived booleans ────────────────────────────────────────────── */
  const swatchesVisible = phase === "waiting" || phase === "flash" || phase === "answered";
  const namesVisible    = phase === "waiting" || phase === "flash" || phase === "answered";
  const buttonsVisible  = phase === "question" || phase === "answered";
  const flashPct        = flashMs / SHOW_MS;

  /* ── sidebar (left column) ───────────────────────────────────────── */
  const sidebar = (
    <>
      {/* Round progress */}
      <div>
        <div style={{ display:"flex", gap:4, marginBottom:5 }}>
          {ROUNDS.map((_, i) => (
            <div key={i} style={{
              height:5, flex:1, borderRadius:99,
              background: i < roundIdx  ? "#6366F1"
                        : i === roundIdx ? (result === "correct" ? "#10b981" : result === "wrong" ? "#ef4444" : "#f59e0b")
                        : "rgba(255,255,255,0.35)",
              transition:"background 0.3s",
            }} />
          ))}
        </div>
        <div style={{ fontSize:12, color:"var(--text-muted)", fontWeight:700, textAlign:"right" }}>
          Round {roundIdx + 1} of {ROUNDS.length}
        </div>
      </div>

      {/* Hard-mode question timer */}
      {phase === "question" && hardMode && (
        <div>
          <div style={{ fontSize:12, fontWeight:700, color: qSecs <= 3 ? "#ef4444" : "var(--text-muted)", marginBottom:4 }}>
            ⏱ {qSecs}s to answer
          </div>
          <div style={{ height:7, borderRadius:99, background:"rgba(255,255,255,0.30)", overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:99,
              width:`${(qSecs / HARD_SECS) * 100}%`,
              background: qSecs <= 3 ? "linear-gradient(90deg,#ef4444,#f87171)" : "linear-gradient(90deg, #4F7BFF, #6366F1)",
              transition:"width 0.9s linear, background 0.3s",
            }} />
          </div>
        </div>
      )}

      {/* Step instruction card */}
      <div style={{
        background:"rgba(255,255,255,0.95)", backdropFilter:"blur(10px)",
        border:"1.5px solid rgba(79,123,255,0.15)", borderRadius:14,
        padding:"12px 16px",
      }}>
        {phase === "waiting" && (
          <>
            <div style={{ fontWeight:800, fontSize:13, color:"#4F7BFF", marginBottom:4 }}>Step 1 of 2 — Memorise!</div>
            <div style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.6 }}>
              Study these colors — the timer starts automatically in a moment.
            </div>
          </>
        )}
        {phase === "flash" && (
          <>
            <div style={{ fontWeight:800, fontSize:13, color:"#6366F1", marginBottom:4 }}>Step 1 of 2 — Memorise!</div>
            <div style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.6 }}>
              Watch the colors carefully. They'll disappear in {(flashMs / 1000).toFixed(1)}s.
            </div>
            <div style={{ marginTop:8, height:6, borderRadius:99, background:"rgba(99,102,241,0.15)", overflow:"hidden" }}>
              <div style={{
                height:"100%", borderRadius:99,
                width:`${flashPct * 100}%`,
                background:"linear-gradient(90deg, #4F7BFF, #6366F1)",
                transition:"width 0.08s linear",
              }} />
            </div>
          </>
        )}
        {phase === "hiding" && (
          <>
            <div style={{ fontWeight:800, fontSize:13, color:"#f59e0b", marginBottom:4 }}>Getting ready…</div>
            <div style={{ fontSize:13, color:"var(--text-muted)" }}>Hold the colors in your mind!</div>
          </>
        )}
        {phase === "question" && (
          <>
            <div style={{ fontWeight:800, fontSize:13, color:"#10b981", marginBottom:4 }}>Step 2 of 2 — Answer!</div>
            <div style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.6 }}>
              Which color scheme were those colors? Click your answer on the right.
            </div>
          </>
        )}
        {phase === "answered" && (
          <>
            <div style={{ fontWeight:800, fontSize:13, color: result === "correct" ? "#10b981" : "#ef4444", marginBottom:4 }}>
              {result === "correct" ? "✅ Correct! +25 pts" : "❌ Not quite! −5 pts"}
            </div>
            <div style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.6 }}>
              {round.explain}
            </div>
          </>
        )}
      </div>

      {/* Score tally */}
      <div style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textAlign:"center" }}>
        {correct} correct so far
        {!hardMode && <span style={{ color:"#6366F1" }}> · No time limit — take your time!</span>}
      </div>

      {/* Answer buttons — in sidebar so they always show on mobile too */}
      {buttonsVisible && (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {SCHEMES.map(s => (
            <SchemeBtn
              key={s} label={s}
              onClick={handleAnswer}
              disabled={phase === "answered"}
              state={
                result && s === round.label ? "correct" :
                result && s === chosen      ? "wrong"   : null
              }
            />
          ))}
        </div>
      )}

      {/* Scheme reveal badge after answering */}
      {phase === "answered" && (() => {
        const meta = SCHEME_META[round.label];
        return (
          <div className="anim-pop" style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"10px 24px", borderRadius:99,
            background:`${meta.color}22`,
            border:`2px solid ${meta.color}55`,
            fontFamily:"var(--font-display)", fontSize:17, fontWeight:700,
            color:meta.color,
          }}>
            {meta.icon} {round.label}
          </div>
        );
      })()}

      {/* Next button */}
      {phase === "answered" && (
        <button className="anim-pop" onClick={handleNext} style={{
          background:"linear-gradient(135deg, #4F7BFF, #6366F1)", color:"white",
          fontFamily:"var(--font-display)", fontWeight:700, fontSize:17,
          padding:"13px 0", borderRadius:14, width:"100%",
          boxShadow:"0 6px 24px rgba(99,102,241,0.35)",
          cursor:"pointer",
        }}>
          {roundIdx + 1 < ROUNDS.length ? "Next Round →" : "Finish! 🎉"}
        </button>
      )}
    </>
  );

  /* ── right column content ────────────────────────────────────────── */
  const rightContent = (
    <div style={{
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      gap:24, width:"100%", maxWidth:500, margin:"0 auto",
      padding:"0 8px",
    }}>

      {/* Big phase heading */}
      <div style={{
        fontFamily:"var(--font-display)", fontSize:18, fontWeight:700,
        color:"var(--text)",
        background:"rgba(255,255,255,0.95)", backdropFilter:"blur(8px)",
        padding:"10px 20px", borderRadius:99,
        border:"1.5px solid rgba(79,123,255,0.15)",
        textAlign:"center", width:"100%",
      }}>
        {(phase === "waiting" || phase === "flash") && "👀 Look carefully — remember these colors!"}
        {phase === "hiding"   && "🫣 Colors hidden…"}
        {phase === "question" && "🤔 Which color scheme was shown?"}
        {phase === "answered" && (result === "correct" ? "✅ Correct!" : "❌ Not quite…")}
      </div>

      {/* Swatch display — always rendered, visibility toggled */}
      <div style={{ display:"flex", gap:12, alignItems:"center", justifyContent:"center", flexWrap:"wrap", width:"100%" }}>
        {round.swatches.map((sw, i) => (
          <Swatch
            key={i}
            hue={sw.hue} L={sw.L}
            visible={swatchesVisible}
            name={round.names[i]}
            showName={namesVisible}
          />
        ))}
      </div>

      {/* Hidden placeholder text during question phase */}
      {phase === "question" && (
        <div style={{
          fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.65)",
          letterSpacing:"0.06em", textTransform:"uppercase",
          background:"rgba(0,0,0,0.12)", padding:"6px 18px", borderRadius:99,
        }}>
          Colors hidden — check the left panel to answer
        </div>
      )}
    </div>
  );

  return (
    <LevelWrapper
      icon="🧠"
      title="Color Memory Challenge"
      hardMode={hardMode}
      description="Colors are shown after the countdown. Study them — the 2s timer starts automatically. Then they disappear and you name the scheme!"
      bullets={[
        "Step 1: Colors appear — study them",
        "Step 2: Timer starts automatically after 3s",
        "Step 3: Choose the correct color scheme",
        "+25 correct · −5 wrong",
        hardMode ? `⏱ Hard mode: ${HARD_SECS}s per question` : "Easy mode: no time pressure",
      ]}
    >
      <GameLayout
        narratorTitle="Color Memory Challenge"
        narratorText={
          phase === "waiting"  ? "Study the colors carefully — the timer will start automatically in a moment!" :
          phase === "flash"    ? "Study the colors carefully — remember how they relate to each other!" :
          phase === "hiding"   ? "Hold the image in your mind…" :
          phase === "question" ? "What color scheme did you see? Analogous? Complementary? Triadic? Monochromatic?" :
          result === "correct" ? `Correct! ${round.explain}` :
                                 `The answer was ${round.label}. ${round.explain}`
        }
        narratorHint={phase === "question" ? "Think about how the colors relate — neighbors, opposites, or a triangle?" : null}
        sidebarBottom={sidebar}
      >
        {rightContent}
      </GameLayout>
    </LevelWrapper>
  );
}
