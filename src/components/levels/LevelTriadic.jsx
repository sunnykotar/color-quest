/**
 * LevelTriadic — Triadic Colors
 *
 * Player selects 3 colors evenly spaced around the wheel (120° apart).
 * On the 12-color wheel: 4 segments apart.
 * 4 triadic challenges. +25 correct, −10 wrong.
 *
 * Easy mode: no timer.
 * Hard mode: 24-seg wheel, 7 s timer.
 */
import React, { useState, useRef } from "react";
import ColorWheel, { WHEEL, WHEEL_24, isTriadic } from "../ColorWheel.jsx";
import GameLayout   from "../GameLayout.jsx";
import LevelWrapper from "../LevelWrapper.jsx";
import StatsOverlay from "../StatsOverlay.jsx";

const PTS = 25;
const PEN = 10;

/* Triadic sets on the 12-seg wheel (indices 0,4,8 etc.) */
/* Triadic sets on the 12-seg wheel — exactly 4 indices apart.
   New WHEEL: idx0=Red(0), idx4=Yellow(60), idx8=Blue(220)
              idx1=R-Orange(22), idx5=Y-Green(90), idx9=B-Violet(248)
              idx2=Orange(38), idx6=Green(135), idx10=Violet(270)
              idx3=Y-Orange(52), idx7=Blue-Green(165), idx11=R-Violet(330) */
const TRIADIC_SETS_12 = [
  [0,   60,  220],  // Red → Yellow → Blue           (idx 0,4,8)
  [22,  90,  248],  // Red-Orange → Yellow-Green → Blue-Violet (idx 1,5,9)
  [38,  135, 270],  // Orange → Green → Violet        (idx 2,6,10)
  [52,  165, 330],  // Yellow-Orange → Blue-Green → Red-Violet (idx 3,7,11)
];

/* Triadic sets on the 24-seg wheel (indices 0,8,16) */
const TRIADIC_SETS_24 = [
  [0,   120, 240],  // Red, Lime, Royal Blue
  [45,  165, 285],  // Orange, Teal, Purple
  [15,  135, 255],  // Red+, Green, Blue-Violet
  [75,  195, 315],  // Yellow, Sky, Red-Violet
];

/* Round descriptor for the intro/narrator */
const ROUND_NAMES = ["Round 1", "Round 2", "Round 3", "Round 4"];

const EXAMPLES_12 = [
  "Red → Yellow → Blue",
  "Orange → Green → Violet",
];

export default function LevelTriadic({ onComplete, addPoints, hardMode = false }) {
  const wheel    = hardMode ? WHEEL_24 : WHEEL;
  const timerS   = hardMode ? 7 : 0;
  const sets     = hardMode ? TRIADIC_SETS_24 : TRIADIC_SETS_12;
  const ROUNDS   = sets.length;

  // Shuffle once on mount so each playthrough uses a different order
  // and the same combination never appears twice in a session
  const [shuffledSets] = useState(() => {
    const arr = [...sets];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const [roundIdx,   setRoundIdx]   = useState(0);
  const [selected,   setSelected]   = useState([]);   // hues picked so far
  const [flash,      setFlash]      = useState(null); // "correct"|"wrong"|null
  const [pairsFound, setPairsFound] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timerKey,   setTimerKey]   = useState(0);
  const [showStats,  setShowStats]  = useState(false);
  const [lastTriad,  setLastTriad]  = useState(null); // hues of last correct set
  const [usedTriads, setUsedTriads] = useState([]);   // sorted hue keys already completed

  const correctRef = useRef(0);
  const totalRef   = useRef(0);
  const timesRef   = useRef([]);
  const t0         = useRef(Date.now());

  const done = pairsFound >= ROUNDS;

  const resetRound = (keepScore = true) => {
    setSelected([]);
    setFlash(null);
    setLastTriad(null);
    setTimerKey(k => k + 1);
    t0.current = Date.now();
  };

  const handleTimerExpire = () => {
    if (flash || done) return;
    totalRef.current++;
    addPoints(-PEN);
    setLevelScore(s => Math.max(0, s - PEN));
    setWrongCount(w => w + 1);
    resetRound();
  };

  const handleSelect = (seg) => {
    if (flash || done) return;
    const hue = seg.hue;

    // Toggle off if already selected
    if (selected.includes(hue)) {
      setSelected(s => s.filter(h => h !== hue));
      return;
    }

    const next = [...selected, hue];

    // Always commit the selection immediately so the wheel + narrator
    // reflects all 3 picks right away (fixes 3rd-color display bug)
    setSelected(next);

    // Not yet 3 — just wait for more clicks
    if (next.length < 3) return;

    // Evaluate all 3
    totalRef.current++;
    timesRef.current.push((Date.now() - t0.current) / 1000);

    if (isTriadic(next, wheel)) {
      // Check if this exact combination was already completed
      const key = [...next].sort((a,b)=>a-b).join(",");
      if (usedTriads.includes(key)) {
        // Already found — treat as wrong to prevent cheating same combo
        addPoints(-PEN);
        setLevelScore(s => Math.max(0, s - PEN));
        setWrongCount(w => w + 1);
        setFlash("wrong");
        setTimeout(() => resetRound(), 1200);
        return;
      }
      correctRef.current++;
      addPoints(PTS);
      setLevelScore(s => s + PTS);
      setLastTriad(next);
      setUsedTriads(prev => [...prev, key]);
      setFlash("correct");
      setTimeout(() => {
        const np = pairsFound + 1;
        setPairsFound(np);
        if (np >= ROUNDS) {
          setFlash(null);
          setShowStats(true);
        } else {
          setRoundIdx(i => i + 1);
          resetRound();
        }
      }, 1400);
    } else {
      addPoints(-PEN);
      setLevelScore(s => Math.max(0, s - PEN));
      setWrongCount(w => w + 1);
      // next is already committed via setSelected(next) above
      setFlash("wrong");
      setTimeout(() => resetRound(), 1200);
    }
  };

  const avgTime = timesRef.current.length
    ? timesRef.current.reduce((a, b) => a + b, 0) / timesRef.current.length : 0;

  /* ── Triangle overlay on SVG ─────────────────────────────────────── */
  /* Passed as an "overlay" hint — we just highlight the 3 selected hues */

  /* ── Sidebar ─────────────────────────────────────────────────────── */
  /* Round tracker */
  const RoundTracker = () => (
    <div style={{ display:"flex", gap:7, alignItems:"center" }}>
      {Array(ROUNDS).fill(0).map((_, i) => (
        <div key={i} style={{
          width:32, height:32, borderRadius:8,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:800, transition:"all 0.3s",
          background: i < pairsFound
            ? "linear-gradient(135deg,#10b981,#6366F1)"
            : i === roundIdx ? "rgba(99,102,241,0.15)"
            : "rgba(255,255,255,0.40)",
          border: i < pairsFound ? "none"
                : i === roundIdx ? "2px solid rgba(99,102,241,0.50)"
                : "2px dashed rgba(99,102,241,0.20)",
          color: i < pairsFound ? "white" : "var(--text-muted)",
          boxShadow: i < pairsFound ? "0 3px 10px rgba(99,102,241,0.30)" : "none",
        }}>
          {i < pairsFound ? "✓" : i + 1}
        </div>
      ))}
      <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:700 }}>
        {pairsFound}/{ROUNDS} found
      </span>
    </div>
  );

  /* Selection tracker — shows the 3 slots */
  const SelectionTracker = () => (
    <div style={{
      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(10px)",
      border:"1.5px solid rgba(79,123,255,0.15)", borderRadius:14,
      padding:"12px 14px",
    }}>
      <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:10 }}>
        Your Selection ({selected.length}/3)
      </div>
      <div style={{ display:"flex", gap:10 }}>
        {[0, 1, 2].map(i => {
          const hue = selected[i];
          const seg = hue !== undefined ? wheel.find(s => s.hue === hue) : null;
          return (
            <div key={i} style={{
              flex:1, borderRadius:12, minHeight:54, padding:"0 8px",
              display:"flex", alignItems:"center", justifyContent:"center", gap:7,
              background: seg ? `hsl(${seg.hue},75%,92%)` : "rgba(255,255,255,0.35)",
              border: seg
                ? `2px solid hsl(${seg.hue},65%,70%)`
                : "2px dashed rgba(99,102,241,0.25)",
              transition:"all 0.2s",
              flexDirection:"column",
            }}>
              {seg ? (
                <>
                  <div style={{
                    width:24, height:24, borderRadius:"50%",
                    background:`hsl(${seg.hue},82%,55%)`,
                    boxShadow:`0 0 8px hsl(${seg.hue},82%,55%)55`,
                  }} />
                  <div style={{ fontSize:10, fontWeight:800, color:"var(--text)", textAlign:"center", lineHeight:1.2 }}>
                    {seg.name}
                  </div>
                </>
              ) : (
                <span style={{ fontSize:18, color:"rgba(99,102,241,0.25)" }}>○</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* Flash feedback */
  const FlashMsg = () => flash ? (
    <div className="anim-pop" style={{
      textAlign:"center", fontWeight:700, fontSize:13,
      padding:"9px 14px", borderRadius:11,
      background: flash === "correct" ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)",
      color:      flash === "correct" ? "#10b981" : "#ef4444",
      border:    `1px solid ${flash === "correct" ? "rgba(16,185,129,0.28)" : "rgba(239,68,68,0.28)"}`,
    }}>
      {flash === "correct"
        ? `🔺 Perfect triadic triangle! +${PTS} pts`
        : `✗ Not evenly spaced. −${PEN} pts — try again!`}
    </div>
  ) : null;

  /* Examples reference */
  const ExamplesCard = () => (
    <div style={{
      background:"rgba(99,102,241,0.07)",
      border:"1px solid rgba(99,102,241,0.18)",
      borderRadius:12, padding:"10px 14px",
    }}>
      <div style={{ fontSize:11, fontWeight:800, color:"#6366F1", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:7 }}>
        Example Triads
      </div>
      {EXAMPLES_12.map((ex, i) => (
        <div key={i} style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", marginBottom: i < EXAMPLES_12.length - 1 ? 5 : 0 }}>
          🔺 {ex}
        </div>
      ))}
      <div style={{ marginTop:8, fontSize:11, color:"var(--text-muted)", lineHeight:1.5 }}>
        On a 12-color wheel, triadic colors are <strong>4 steps apart</strong>.
      </div>
    </div>
  );

  const sidebar = (
    <>
      <RoundTracker />
      <SelectionTracker />
      <FlashMsg />
      {!flash && <ExamplesCard />}
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:700 }}>
        <span style={{ color:"#6366F1" }}>+{levelScore} pts this level</span>
        {wrongCount > 0 && <span style={{ color:"#ef4444" }}>{wrongCount} ✗</span>}
      </div>
    </>
  );

  /* ── Triadic triangle SVG overlay ────────────────────────────────── */
  /* We pass the 3 selected hues as "selected" to ColorWheel — it handles
     the highlight/pop-out effect automatically. No extra overlay needed. */

  return (
    <LevelWrapper
      icon="🔺"
      title={hardMode ? "Triadic — Hard" : "Triadic Colors"}
      hardMode={hardMode}
      description={
        hardMode
          ? `On the 24-color wheel, triadic colors are 8 steps apart. Find ${ROUNDS} triadic triangles — you have ${timerS}s per round!`
          : `Triadic colors are evenly spaced around the wheel, forming a perfect triangle. On a 12-color wheel, they're 4 steps apart. Find ${ROUNDS} triadic triangles!`
      }
      bullets={[
        "Click 3 colors that form an equal triangle",
        "On a 12-color wheel: 4 steps apart",
        `+${PTS} pts correct · −${PEN} pts wrong`,
        hardMode ? `⏱ ${timerS}s per round` : "No timer — take your time!",
      ]}
      timerSecs={timerS}
      timerKey={timerKey}
      onTimerExpire={handleTimerExpire}
      showTimer={!done && !showStats}
      hardMode={hardMode}
    >
      <div style={{ height:"100%", position:"relative" }}>
        {showStats && (
          <StatsOverlay
            correct={correctRef.current}
            total={totalRef.current}
            avgTime={avgTime}
            onContinue={onComplete}
          />
        )}
        <GameLayout
          narratorTitle="Triadic Colors"
          narratorText={
            hardMode
              ? "Triadic colors form a perfect equilateral triangle on the wheel, creating vibrant, high-energy contrasts."
              : "Triadic colors sit at equal intervals around the wheel — like the points of an equilateral triangle. They create bold, lively palettes!"
          }
          narratorHint={
            done ? null :
            selected.length === 0 ? "Click any color to start your triangle" :
            selected.length === 1 ? `${wheel.find(s=>s.hue===selected[0])?.name ?? selected[0]}… now pick a color 4 steps away` :
            selected.length === 2 ? `${wheel.find(s=>s.hue===selected[0])?.name} → ${wheel.find(s=>s.hue===selected[1])?.name}… one more!` :
            `Selected: ${selected.map(h => wheel.find(s=>s.hue===h)?.name ?? h).join(" → ")}`
          }
          sidebarBottom={sidebar}
        >
          <ColorWheel
            size={460}
            selected={selected}
            highlighted={lastTriad ?? []}
            wrongHues={flash === "wrong" ? selected : []}
            onSelect={handleSelect}
            showLabels
            wheel={wheel}
          />
        </GameLayout>
      </div>
    </LevelWrapper>
  );
}
