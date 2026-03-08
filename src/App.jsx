import React, { useState, useEffect, useRef } from "react";
import IntroScreen  from "./components/IntroScreen.jsx";
import StartScreen  from "./components/StartScreen.jsx";
import WinScreen    from "./components/WinScreen.jsx";
import Level1       from "./components/levels/Level1.jsx";
import Level3       from "./components/levels/Level3.jsx";
import LevelTriadic from "./components/levels/LevelTriadic.jsx";
import Level2       from "./components/levels/Level2.jsx";
import Level4       from "./components/levels/Level4.jsx";
import Level5       from "./components/levels/Level5.jsx";
import Level6       from "./components/levels/Level6.jsx";
import Level7       from "./components/levels/Level7.jsx";
import Level8       from "./components/levels/Level8.jsx";
import LevelHard    from "./components/levels/LevelHard.jsx";

/* ── Level order ──────────────────────────────────────────────────── */
const LEVELS = [
  { id:1, title:"Primary Colors",   icon:"🎨", Component:Level1,       group:"Foundations" },
  { id:2, title:"Complementary",    icon:"⚡", Component:Level3,       group:"Foundations" },
  { id:3, title:"Triadic",          icon:"🔺", Component:LevelTriadic,  group:"Foundations" },
  { id:4, title:"Analogous",        icon:"🌊", Component:Level2,       group:"Foundations" },
  { id:5, title:"Monochromatic",    icon:"🌑", Component:Level4,       group:"Foundations" },
  { id:6, title:"RGB Light Lab",    icon:"💡", Component:Level5,       group:"Foundations" },
  { id:7, title:"Scheme Detective", icon:"🕵️",  Component:Level6,       group:"Bloom" },
  { id:8, title:"Fix the Palette",  icon:"🔧", Component:Level7,       group:"Bloom" },
  { id:9, title:"Memory Challenge", icon:"🧠", Component:Level8,       group:"Bloom" },
];

const FOUNDS = LEVELS.filter(l => l.group === "Foundations");
const BLOOMS  = LEVELS.filter(l => l.group === "Bloom");

const LS_BEST = "chromaverse_best";
const LS_HARD = "chromaverse_hard_unlocked";

/* ── Floating score popup ─────────────────────────────────────────── */
function ScorePopup({ popups }) {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:300 }}>
      {popups.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:"50%", top:62,
          transform:"translateX(-50%)",
          fontFamily:"var(--font-display)", fontSize:20, fontWeight:700,
          color: p.pts > 0 ? "#4f46e5" : "#ef4444",
          animation:"floatUp 0.9s ease forwards", whiteSpace:"nowrap",
          background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)",
          padding:"5px 20px", borderRadius:99,
          boxShadow:"0 4px 20px rgba(0,0,0,0.12)",
          border:"1.5px solid rgba(255,255,255,0.7)",
        }}>
          {p.pts > 0 ? `+${p.pts}` : p.pts} pts
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function App() {
  /* screen: "intro" → "select" → "game" → "win" */
  const [screen,       setScreen]       = useState("intro");
  const [levelIdx,     setLevelIdx]     = useState(0);
  const [score,        setScore]        = useState(0);
  const [hardMode,     setHardMode]     = useState(false);
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem(LS_BEST) || "0", 10); } catch { return 0; }
  });
  const [hardUnlocked, setHardUnlocked] = useState(() => {
    try { return localStorage.getItem(LS_HARD) === "1"; } catch { return false; }
  });
  const [popups, setPopups] = useState([]);
  const timerRef     = useRef(null);
  const correctCount = useRef(0);
  const totalCount   = useRef(0);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      try { localStorage.setItem(LS_BEST, String(score)); } catch {}
    }
  }, [score]);

  const addPoints = pts => {
    if (!pts) return;
    setScore(s => Math.max(0, s + pts));
    if (pts > 0) correctCount.current++;
    totalCount.current++;
    const id = Date.now() + Math.random();
    setPopups(prev => [...prev, { id, pts }]);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPopups([]), 1100);
  };

  const startGame = (hard, startIdx = 0) => {
    setScore(0);
    setLevelIdx(startIdx);
    correctCount.current = 0;
    totalCount.current   = 0;
    setHardMode(hard);
    setScreen("game");
  };

  const handleComplete = () => {
    if (hardMode) { setScreen("win"); return; }
    if (levelIdx + 1 >= LEVELS.length) {
      if (!hardUnlocked) {
        setHardUnlocked(true);
        try { localStorage.setItem(LS_HARD, "1"); } catch {}
      }
      setScreen("win");
    } else {
      setLevelIdx(i => i + 1);
    }
  };

  const goToSelect = () => {
    setScore(0); setLevelIdx(0);
    correctCount.current = 0; totalCount.current = 0;
    setScreen("select");
  };

  const current  = hardMode
    ? { id:0, title:"Hard Mode", icon:"🔥", Component:LevelHard, group:"Hard" }
    : LEVELS[levelIdx];
  const accuracy = totalCount.current > 0
    ? Math.round((correctCount.current / totalCount.current) * 100) : 0;

  /* ── Intro splash ──────────────────────────────────────────────── */
  if (screen === "intro") {
    return (
      <>
        <ScorePopup popups={popups} />
        <IntroScreen onEnter={() => setScreen("select")} />
      </>
    );
  }

  /* ── Mode Select ───────────────────────────────────────────────── */
  if (screen === "select") {
    return (
      <>
        <ScorePopup popups={popups} />
        <StartScreen
          onStart={(idx = 0) => startGame(false, idx)}
          bestScore={best}
          hardUnlocked={hardUnlocked}
          onStartHard={() => startGame(true)}
        />
      </>
    );
  }

  /* ── Win ───────────────────────────────────────────────────────── */
  if (screen === "win") {
    return (
      <div className="app-root-center">
        <ScorePopup popups={popups} />
        <div className="glass-card" style={{
          width:"100%", maxWidth:480,
          minHeight:"min(600px,90vh)",
          display:"flex", flexDirection:"column", overflow:"hidden",
        }}>
          <WinScreen
            onRestart={goToSelect}
            score={score} best={best} accuracy={accuracy}
          />
        </div>
      </div>
    );
  }

  /* ── Game screen ───────────────────────────────────────────────── */
  return (
    <>
      <ScorePopup popups={popups} />

      {/* Fixed HUD strip */}
      <div className="hud-strip">
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:3 }}>
          {/* Progress bars */}
          {!hardMode ? (
            <div style={{ display:"flex", gap:3, alignItems:"center" }}>
              {FOUNDS.map((l, i) => (
                <div key={l.id} style={{
                  height:5, flex:1, borderRadius:99,
                  background: i < levelIdx  ? "#6366F1"
                            : i === levelIdx ? "linear-gradient(90deg,#6366F1,#7C8CFF)"
                            : "rgba(255,255,255,0.38)",
                  transition:"background 0.4s",
                }} />
              ))}
              <div style={{ width:2, height:11, borderRadius:99, background:"rgba(255,255,255,0.45)", flexShrink:0 }} />
              {BLOOMS.map((l, i) => {
                const abs = FOUNDS.length + i;
                return (
                  <div key={l.id} style={{
                    height:5, flex:1, borderRadius:99,
                    background: levelIdx > abs  ? "#f59e0b"
                              : levelIdx === abs ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                              : "rgba(255,255,255,0.28)",
                    transition:"background 0.4s",
                  }} />
                );
              })}
            </div>
          ) : (
            <div style={{ height:5, borderRadius:99, background:"linear-gradient(90deg,#ef4444,#f59e0b)", width:200 }} />
          )}

          <div style={{ display:"flex", alignItems:"center", gap:6, minWidth:0 }}>
            <span style={{ fontFamily:"var(--font-display)", fontSize:"clamp(11px,3vw,13px)", fontWeight:700, color:"#1e1b4b", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"clamp(80px,25vw,200px)" }}>
              {current.icon} {current.title}
            </span>
            {!hardMode && (
              <span className="hud-badge" style={{
                fontSize:9, fontWeight:800, letterSpacing:"0.07em", textTransform:"uppercase",
                padding:"1px 7px", borderRadius:99, flexShrink:0,
                background: current.group === "Bloom" ? "rgba(245,158,11,0.18)" : "rgba(99,102,241,0.12)",
                color: current.group === "Bloom" ? "#b45309" : "#4f46e5",
              }}>
                {current.group}
              </span>
            )}
            {hardMode && (
              <span style={{ fontSize:10, background:"rgba(239,68,68,0.15)", color:"#dc2626", padding:"2px 7px", borderRadius:99, flexShrink:0 }}>
                🔥 Hard
              </span>
            )}
          </div>
        </div>

        {/* Back to menu */}
        <button onClick={goToSelect} style={{
          background:"rgba(255,255,255,0.55)", backdropFilter:"blur(8px)",
          border:"1px solid rgba(255,255,255,0.55)", borderRadius:99,
          padding:"5px clamp(8px,2vw,14px)", fontSize:11, fontWeight:700,
          color:"var(--text-muted)", cursor:"pointer", flexShrink:0,
          transition:"background 0.15s", whiteSpace:"nowrap",
        }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.80)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.55)"}
        >
          ← Menu
        </button>

        {/* Score */}
        <div style={{
          display:"flex", alignItems:"center", gap:5,
          background:"rgba(255,255,255,0.60)", backdropFilter:"blur(8px)",
          borderRadius:99, padding:"5px 16px", flexShrink:0,
          border:"1px solid rgba(255,255,255,0.55)",
        }}>
          <span style={{ fontSize:14, fontWeight:800, color:"#4f46e5", fontFamily:"var(--font-display)" }}>
            ★ {score}
          </span>
          {best > 0 && (
            <span style={{ fontSize:10, color:"var(--text-muted)", fontWeight:600 }}>
              &nbsp;/ {best} best
            </span>
          )}
        </div>
      </div>

      {/* Game area */}
      <div className="app-root">
        {React.createElement(current.Component, {
          key: `${hardMode ? "hard" : levelIdx}`,
          onComplete: handleComplete,
          addPoints,
          hardMode,
        })}
      </div>
    </>
  );
}
