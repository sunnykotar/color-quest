/**
 * Level3 — Complementary Colors
 *
 * Find 4 complementary pairs on the color wheel.
 * Step 1: click any color.
 * Step 2: click the color directly opposite on the wheel.
 *
 * Easy mode : no timer — player can think freely.
 * Hard mode : 7 s timer per round, 24-color wheel.
 *
 * +25 per correct pair, streak bonuses, −10 wrong/timeout.
 */
import React, { useState, useRef } from "react";
import ColorWheel, { WHEEL, WHEEL_24, isComplementary } from "../ColorWheel.jsx";
import GameLayout    from "../GameLayout.jsx";
import LevelWrapper  from "../LevelWrapper.jsx";
import StreakBadge   from "../StreakBadge.jsx";
import StatsOverlay  from "../StatsOverlay.jsx";

const PTS   = 25;
const PEN   = 10;
const PAIRS = 4;

function streakBonus(s) { return s >= 5 ? 25 : s >= 3 ? 10 : 0; }

/* Example complements shown in the intro/hint area */
const EXAMPLES = [
  { a:"Red",    b:"Green"  },
  { a:"Orange", b:"Blue"   },
  { a:"Yellow", b:"Violet" },
];

export default function Level3({ onComplete, addPoints, hardMode = false }) {
  const wheel  = hardMode ? WHEEL_24 : WHEEL;
  const timerS = hardMode ? 7 : 0;   // ← NO timer in easy mode

  const [first,      setFirst]      = useState(null);
  const [second,     setSecond]     = useState(null);  // tracks 2nd click for UI display
  const [flash,      setFlash]      = useState(null);   // "correct" | "wrong" | null
  const [matched,    setMatched]    = useState([]);
  const [pairsFound, setPairsFound] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak,     setStreak]     = useState(0);
  const [timerKey,   setTimerKey]   = useState(0);
  const [showStats,  setShowStats]  = useState(false);
  const [lastPair,   setLastPair]   = useState(null);

  const correctRef = useRef(0);
  const totalRef   = useRef(0);
  const timesRef   = useRef([]);
  const t0         = useRef(Date.now());

  const done = pairsFound >= PAIRS;

  const resetRound = () => { setTimerKey(k => k + 1); t0.current = Date.now(); };

  const handleTimerExpire = () => {
    if (flash || done) return;
    totalRef.current++;
    setStreak(0); addPoints(-PEN);
    setLevelScore(p => Math.max(0, p - PEN));
    setWrongCount(w => w + 1);
    setFirst(null);
    resetRound();
  };

  const handleSelect = seg => {
    if (flash || done) return;
    if (matched.includes(seg.hue)) return;

    if (!first) { setFirst(seg); setSecond(null); return; }
    if (seg.hue === first.hue) { setFirst(null); setSecond(null); return; }

    // Commit second pick immediately so wheel highlights it right away
    setSecond(seg);

    const isMatch = isComplementary(first.hue, seg.hue, wheel);
    totalRef.current++;
    timesRef.current.push((Date.now() - t0.current) / 1000);

    if (isMatch) {
      correctRef.current++;
      const ns = streak + 1;
      setStreak(ns);
      const earned = PTS + streakBonus(ns);
      setLastPair({ a: first, b: seg });
      setFlash("correct");
      setLevelScore(p => p + earned);
      addPoints(earned);
      setTimeout(() => {
        const np = pairsFound + 1;
        setMatched(m => [...m, first.hue, seg.hue]);
        setPairsFound(np);
        setFlash(null); setFirst(null); setSecond(null); setLastPair(null);
        if (np >= PAIRS) setShowStats(true); else resetRound();
      }, 1300);
    } else {
      setStreak(0); setFlash("wrong");
      setWrongCount(w => w + 1);
      addPoints(-PEN);
      setLevelScore(p => Math.max(0, p - PEN));
      setTimeout(() => { setFlash(null); setFirst(null); setSecond(null); resetRound(); }, 1200);
    }
  };

  // Both first and second highlight on the wheel as soon as they're picked
  const selectedHues = [
    ...(first  ? [first.hue]  : []),
    ...(second ? [second.hue] : []),
  ];
  const wrongHues = flash === "wrong" ? selectedHues : [];
  const avgTime      = timesRef.current.length
    ? timesRef.current.reduce((a, b) => a + b, 0) / timesRef.current.length : 0;

  /* ── Pair preview panel ──────────────────────────────────────────── */
  const PreviewPanel = () => (
    <div style={{
      background:"rgba(255,255,255,0.60)", backdropFilter:"blur(10px)",
      border:"1.5px solid rgba(255,255,255,0.55)", borderRadius:14,
      padding:"12px 14px",
    }}>
      <div style={{ fontSize:11, fontWeight:800, color:"var(--text-muted)", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:8 }}>
        Your Selection
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        {/* First color */}
        <div style={{
          flex:1, borderRadius:12, minHeight:52, padding:"0 10px",
          display:"flex", alignItems:"center", gap:8,
          background: first ? `hsl(${first.hue},75%,93%)` : "rgba(255,255,255,0.40)",
          border: first
            ? `2px solid hsl(${first.hue},70%,68%)`
            : "2px dashed rgba(99,102,241,0.30)",
          transition:"all 0.2s",
        }}>
          {first ? (
            <>
              <div style={{
                width:28, height:28, borderRadius:"50%", flexShrink:0,
                background:`hsl(${first.hue},82%,55%)`,
                boxShadow:`0 0 10px hsl(${first.hue},82%,55%)66`,
              }} />
              <div>
                <div style={{ fontSize:10, color:"var(--text-muted)", fontWeight:700 }}>Selected</div>
                <div style={{ fontSize:13, fontWeight:800, color:"var(--text)" }}>
                  {hardMode ? `${first.hue}°` : first.name}
                </div>
              </div>
            </>
          ) : (
            <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:600 }}>
              Click any color…
            </span>
          )}
        </div>

        {/* Arrow */}
        <div style={{
          fontSize:22, flexShrink:0, transition:"color 0.15s",
          color: flash === "correct" ? "#10b981" : flash === "wrong" ? "#ef4444" : "rgba(99,102,241,0.35)",
        }}>
          ↔
        </div>

        {/* Second color */}
        <div style={{
          flex:1, borderRadius:12, minHeight:52, padding:"0 10px",
          display:"flex", alignItems:"center", gap:8,
          background: (flash === "correct" && lastPair) ? `hsl(${lastPair.b.hue},75%,93%)`
                    : second ? `hsl(${second.hue},75%,93%)`
                    : flash === "wrong" ? "rgba(239,68,68,0.07)"
                    : "rgba(255,255,255,0.40)",
          border: flash === "correct" ? "2px solid #10b981"
                : flash === "wrong"   ? "2px solid #ef4444"
                : second ? `2px solid hsl(${second.hue},65%,70%)`
                : first ? "2px dashed rgba(99,102,241,0.50)"
                : "2px dashed rgba(99,102,241,0.20)",
          transition:"all 0.2s",
        }}>
          {(flash === "correct" && lastPair) ? (
            <>
              <div style={{
                width:28, height:28, borderRadius:"50%", flexShrink:0,
                background:`hsl(${lastPair.b.hue},82%,55%)`,
                boxShadow:`0 0 10px hsl(${lastPair.b.hue},82%,55%)66`,
              }} />
              <div>
                <div style={{ fontSize:10, color:"#10b981", fontWeight:700 }}>Complement ✓</div>
                <div style={{ fontSize:13, fontWeight:800, color:"var(--text)" }}>
                  {hardMode ? `${lastPair.b.hue}°` : lastPair.b.name}
                </div>
              </div>
            </>
          ) : second ? (
            <>
              <div style={{
                width:28, height:28, borderRadius:"50%", flexShrink:0,
                background:`hsl(${second.hue},82%,55%)`,
                boxShadow:`0 0 10px hsl(${second.hue},82%,55%)66`,
              }} />
              <div>
                <div style={{ fontSize:10, color: flash === "wrong" ? "#ef4444" : "var(--text-muted)", fontWeight:700 }}>
                  {flash === "wrong" ? "Not a complement" : "Second"}
                </div>
                <div style={{ fontSize:13, fontWeight:800, color:"var(--text)" }}>
                  {hardMode ? `${second.hue}°` : second.name}
                </div>
              </div>
            </>
          ) : (
            <span style={{ fontSize:12, color: first ? "#6366F1" : "var(--text-muted)", fontWeight:600 }}>
              {first ? "…now click its opposite" : "Its complement"}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  /* ── Pair tracker ───────────────────────────────────────────────── */
  const PairTracker = () => (
    <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap" }}>
      {Array(PAIRS).fill(0).map((_, i) => (
        <div key={i} style={{
          width:32, height:32, borderRadius:8,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:800, transition:"all 0.3s",
          background: i < pairsFound ? "linear-gradient(135deg,#10b981,#6366F1)" : "rgba(255,255,255,0.45)",
          border: i < pairsFound ? "none" : "2px dashed rgba(99,102,241,0.25)",
          color: i < pairsFound ? "white" : "var(--text-muted)",
          boxShadow: i < pairsFound ? "0 3px 10px rgba(99,102,241,0.30)" : "none",
        }}>
          {i < pairsFound ? "✓" : i + 1}
        </div>
      ))}
      <StreakBadge streak={streak} />
    </div>
  );

  /* ── Flash feedback ─────────────────────────────────────────────── */
  const FlashMsg = () => flash ? (
    <div className="anim-pop" style={{
      textAlign:"center", fontWeight:700, fontSize:13,
      padding:"9px 14px", borderRadius:11,
      background: flash === "correct" ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)",
      color:      flash === "correct" ? "#10b981" : "#ef4444",
      border:    `1px solid ${flash === "correct" ? "rgba(16,185,129,0.28)" : "rgba(239,68,68,0.28)"}`,
    }}>
      {flash === "correct"
        ? `✓ Complement found! +${PTS}${streakBonus(streak) ? ` +${streakBonus(streak)} streak bonus!` : ""}`
        : `✗ Not complementary. −${PEN} pts · streak reset`}
    </div>
  ) : null;

  /* ── Examples reference ─────────────────────────────────────────── */
  const ExamplesCard = () => (
    <div style={{
      background:"rgba(99,102,241,0.07)",
      border:"1px solid rgba(99,102,241,0.18)",
      borderRadius:12, padding:"10px 14px",
    }}>
      <div style={{ fontSize:11, fontWeight:800, color:"#6366F1", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:7 }}>
        Example Pairs
      </div>
      {EXAMPLES.map((ex, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:"var(--text-muted)", marginBottom: i < EXAMPLES.length - 1 ? 4 : 0 }}>
          <span style={{ color:"var(--text)", fontWeight:700 }}>{ex.a}</span>
          <span style={{ color:"#6366F1" }}>↔</span>
          <span style={{ color:"var(--text)", fontWeight:700 }}>{ex.b}</span>
        </div>
      ))}
    </div>
  );

  const sidebar = (
    <>
      <PairTracker />
      <PreviewPanel />
      <FlashMsg />
      {!done && !flash && <ExamplesCard />}
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:700 }}>
        <span style={{ color:"#6366F1" }}>+{levelScore} pts this level</span>
        {wrongCount > 0 && <span style={{ color:"#ef4444" }}>{wrongCount} ✗ (−{wrongCount * PEN})</span>}
      </div>
    </>
  );

  return (
    <LevelWrapper
      icon="⚡"
      title={hardMode ? "Complementary — Hard" : "Complementary Colors"}
      hardMode={hardMode}
      description={
        hardMode
          ? `On the 24-color wheel, complements are exactly 12 steps apart. Find ${PAIRS} pairs — you have ${timerS}s per round!`
          : `Complementary colors sit directly opposite each other on the wheel. Click a color, then click the color directly opposite. Find ${PAIRS} pairs!`
      }
      bullets={[
        "Click any color on the wheel",
        "Then click the color directly opposite",
        `+${PTS} pts per correct pair · streaks earn bonuses`,
        hardMode ? `⏱ ${timerS}s per round · −${PEN} timeout` : "No timer — take your time!",
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
          narratorTitle="Complementary Colors"
          narratorText={
            hardMode
              ? "On a 24-color wheel, complements are exactly 12 positions apart. They create the strongest possible contrast."
              : "Complementary colors are opposites on the color wheel. They create vivid contrast and make each other look more vibrant!"
          }
          narratorHint={
            done ? null :
            second ? `${first?.name} ↔ ${second?.name} — checking…` :
            first
              ? `${first.name} selected — now click its opposite on the wheel`
              : "Click any color on the wheel to start"
          }
          sidebarBottom={sidebar}
        >
          <ColorWheel
            size={440}
            selected={selectedHues}
            highlighted={matched}
            wrongHues={wrongHues}
            onSelect={handleSelect}
            showLabels
            wheel={wheel}
          />
        </GameLayout>
      </div>
    </LevelWrapper>
  );
}
