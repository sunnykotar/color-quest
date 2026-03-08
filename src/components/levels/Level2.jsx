import React, { useState, useRef } from "react";
import ColorWheel, { WHEEL, WHEEL_24, isAnalogous } from "../ColorWheel.jsx";
import GameLayout   from "../GameLayout.jsx";
import LevelWrapper from "../LevelWrapper.jsx";
import StreakBadge  from "../StreakBadge.jsx";

const PTS_CORRECT = 60;  // decreases with wrong attempts
const PTS_PENALTY = 10;

function calcPts(wrong) { return Math.max(10, PTS_CORRECT - wrong * 10); }
function streakBonus(s) { return s >= 5 ? 20 : s >= 3 ? 10 : 0; }

// Hard mode: 4 consecutive neighbors
function isAnalogous4(hues, wheel) {
  if (hues.length !== 4) return false;
  const idxs = hues.map(h => wheel.findIndex(s => s.hue === h)).sort((a, b) => a - b);
  if (idxs.includes(-1)) return false;
  if (idxs[3] === idxs[0] + 3) return true;
  const wrapped = [idxs[0] + wheel.length, idxs[1], idxs[2], idxs[3]].sort((a, b) => a - b);
  return wrapped[3] === wrapped[0] + 3;
}

export default function Level2({ onComplete, addPoints, hardMode = false }) {
  const wheel   = hardMode ? WHEEL_24 : WHEEL;
  const pickN   = hardMode ? 4 : 3;
  const timerS  = hardMode ? 7 : 10;
  const checkFn = hardMode ? h => isAnalogous4(h, WHEEL_24) : h => isAnalogous(h);

  const [selectedSegs, setSelectedSegs] = useState([]);
  const [result,       setResult]       = useState(null);
  const [wrongCount,   setWrongCount]   = useState(0);
  const [awarded,      setAwarded]      = useState(false);
  const [streak,       setStreak]       = useState(0);
  const [timerKey,     setTimerKey]     = useState(0);

  const selectedHues = selectedSegs.map(s => s.hue);
  const isCorrect    = result === "correct";

  const resetRound = () => {
    setTimerKey(k => k + 1);
    setSelectedSegs([]);
    setResult(null);
  };

  // Timer expire: -10 pts, reset streak, move to next attempt
  const handleTimerExpire = () => {
    if (isCorrect) return;   // don't fire after success
    addPoints(-PTS_PENALTY);
    setStreak(0);
    setWrongCount(w => w + 1);
    resetRound();
  };

  const handleSelect = seg => {
    if (isCorrect) return;
    setResult(null);
    setSelectedSegs(prev => {
      if (prev.some(s => s.hue === seg.hue)) return prev.filter(s => s.hue !== seg.hue);
      if (prev.length >= pickN) return [...prev.slice(1), seg];
      return [...prev, seg];
    });
  };

  const handleCheck = () => {
    if (selectedSegs.length < pickN) return;
    if (checkFn(selectedHues)) {
      const ns = streak + 1;
      setStreak(ns);
      const earned = calcPts(wrongCount) + streakBonus(ns);
      setResult("correct");
      if (!awarded) { addPoints(earned); setAwarded(true); }
    } else {
      setWrongCount(w => w + 1);
      setStreak(0);
      setResult("wrong");
      setTimeout(() => resetRound(), 1200);
    }
  };

  const highlighted = isCorrect ? selectedHues : [];
  const dimmed      = isCorrect ? wheel.map(s => s.hue).filter(h => !selectedHues.includes(h)) : [];

  const sidebar = (
    <>
      {/* Streak badge */}
      {streak > 0 && (
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <StreakBadge streak={streak} />
        </div>
      )}

      {/* Selection slots */}
      <div style={{ display:"flex", gap:8 }}>
        {Array(pickN).fill(0).map((_, i) => {
          const seg = selectedSegs[i];
          return (
            <div key={i} style={{
              flex:1, height:50, borderRadius:12,
              background: seg ? `hsl(${seg.hue},85%,55%)` : "#EEF6FF",
              border: seg
                ? isCorrect         ? "2px solid #10b981"
                : result === "wrong"? "2px solid #ef4444"
                : "2px solid rgba(255,255,255,0.4)"
                : "2px dashed #D7E0FF",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:700,
              color: seg ? "white" : "var(--text-muted)",
              transition:"all 0.22s",
            }}>
              {seg ? (hardMode ? `${seg.hue}°` : seg.name) : `Pick ${i + 1}`}
            </div>
          );
        })}
      </div>

      {result === "wrong" && (
        <div style={{ textAlign:"center", color:"#ef4444", fontWeight:700, fontSize:13, padding:"8px 14px", background:"rgba(239,68,68,0.07)", borderRadius:10, border:"1px solid rgba(239,68,68,0.2)" }}>
          ✗ Not {pickN} consecutive neighbors — try again!
        </div>
      )}
      {isCorrect && (
        <div className="anim-pop" style={{ textAlign:"center", color:"#10b981", fontWeight:700, fontSize:13, padding:"8px 14px", background:"rgba(16,185,129,0.07)", borderRadius:10, border:"1px solid rgba(16,185,129,0.2)" }}>
          ✓ {selectedSegs.map(s => hardMode ? s.hue + "°" : s.name).join(" → ")}!
        </div>
      )}

      <div style={{ display:"flex", gap:8 }}>
        {!isCorrect && (
          <button
            onClick={handleCheck}
            disabled={selectedSegs.length < pickN}
            style={{
              flex:1, padding:"13px 0", borderRadius:14,
              fontFamily:"var(--font-display)", fontWeight:600, fontSize:16,
              background: selectedSegs.length < pickN ? "#EEF6FF" : "#6366F1",
              color: selectedSegs.length < pickN ? "var(--text-muted)" : "white",
              opacity: selectedSegs.length < pickN ? 0.5 : 1,
              transition:"all 0.2s",
              boxShadow: selectedSegs.length >= pickN ? "0 4px 16px rgba(99,102,241,0.3)" : "none",
            }}
          >Check ✓</button>
        )}
        {isCorrect && (
          <button className="anim-pop" onClick={onComplete} style={{
            flex:1, background:"linear-gradient(135deg, #4F7BFF, #6366F1)", color:"white",
            fontFamily:"var(--font-display)", fontWeight:700, fontSize:17, padding:"14px 0",
            borderRadius:14, boxShadow:"0 6px 24px rgba(99,102,241,0.35)",
          }}>Next Level →</button>
        )}
      </div>
    </>
  );

  return (
    <LevelWrapper
      icon="🌊"
      title={hardMode ? "Analogous Colors — Hard" : "Analogous Colors"}
      hardMode={hardMode}
      description={hardMode
        ? "On the 24-color wheel, pick 4 consecutive neighbors. You have 7 seconds per attempt."
        : "Pick 3 colors that sit side-by-side on the wheel. Analogous palettes feel calm and harmonious. You have 10 seconds per attempt."}
      bullets={hardMode
        ? [`Select 4 consecutive segments`, "They must be perfectly adjacent — no gaps", `${timerS}s per attempt · −${PTS_PENALTY} pts if time runs out`]
        : [`Select 3 side-by-side segments`, "Press Check to verify", `${timerS}s per attempt · −${PTS_PENALTY} pts if time runs out`]}
      timerSecs={timerS}
      timerKey={timerKey}
      onTimerExpire={handleTimerExpire}
      showTimer={!isCorrect}
    >
      <GameLayout
        narratorTitle={hardMode ? "4 Neighbors" : "Analogous Colors"}
        narratorText="Analogous colors share undertones and sit next to each other on the wheel. They create cohesive, peaceful palettes."
        narratorHint={!isCorrect ? `Click ${pickN} neighboring segments, then press Check.` : null}
        sidebarBottom={sidebar}
      >
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <ColorWheel
            size={440}
            selected={selectedHues}
            highlighted={highlighted}
            dimmed={dimmed}
            onSelect={handleSelect}
            showLabels
            wheel={wheel}
          />
        </div>
      </GameLayout>
    </LevelWrapper>
  );
}
