import React, { useState } from "react";
import ColorWheel, { WHEEL_24 } from "../ColorWheel.jsx";
import GameLayout   from "../GameLayout.jsx";
import LevelWrapper from "../LevelWrapper.jsx";

const PRIMARIES_12   = [0, 60, 220];
const SECONDARIES_12 = [38, 135, 270];  // Orange(idx2), Green(idx6), Violet(idx10)
// Hard mode: evenly-spaced primaries & secondaries on 24-seg wheel
const PRIMARIES_24   = [0, 120, 240];
const SECONDARIES_24 = [60, 180, 300];

export default function Level1({ onComplete, addPoints, hardMode = false }) {
  const wheel      = hardMode ? WHEEL_24 : undefined; // undefined = default WHEEL
  const primaries  = hardMode ? PRIMARIES_24  : PRIMARIES_12;
  const secondaries= hardMode ? SECONDARIES_24 : SECONDARIES_12;

  const [selected,  setSelected]  = useState([]);
  const [phase,     setPhase]     = useState("primary");
  const [particles, setParticles] = useState([]);

  const handleSelect = seg => {
    if (phase === "done") return;
    if (selected.includes(seg.hue)) return;
    if (phase === "primary"   && !primaries.includes(seg.hue))   return;
    if (phase === "secondary" && !secondaries.includes(seg.hue)) return;

    const next = [...selected, seg.hue];
    setSelected(next);
    addPoints(primaries.includes(seg.hue) ? 20 : 15);

    const pid = Date.now() + Math.random();
    setParticles(p => [...p, { id:pid, color:`hsl(${seg.hue},80%,62%)` }]);
    setTimeout(() => setParticles(p => p.filter(x => x.id !== pid)), 900);

    if (primaries.every(h => next.includes(h))   && phase === "primary")   setTimeout(() => setPhase("secondary"), 500);
    if (secondaries.every(h => next.includes(h)) && phase === "secondary") setTimeout(() => setPhase("done"), 600);
  };

  const highlighted = phase === "primary" ? primaries : phase === "secondary" ? secondaries : [];

  const narData = {
    primary:   { title:"Primary Colors",            hint:`Click the ${primaries.length} highlighted segments (+20 pts each)` },
    secondary: { title:"Secondary Colors Unlocked! 🎉", hint:`Now click the ${secondaries.length} secondary segments (+15 pts each)` },
    done:      { title:"Color Wheel Complete! ✨",   hint:null },
  };
  const nc = narData[phase];

  const sidebar = (
    <>
      <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
        {[...primaries.map(h => ({ h, group:"primary" })), ...secondaries.map(h => ({ h, group:"secondary" }))].map(({ h, group }) => {
          const found  = selected.includes(h);
          const locked = group === "secondary" && phase === "primary";
          return (
            <div key={h} style={{
              padding:"5px 12px", borderRadius:99, fontSize:12, fontWeight:700,
              background: found ? `hsl(${h},72%,52%)` : "#EEF2FF",
              color: found ? "white" : "var(--text-muted)",
              border: found ? `2px solid hsl(${h},80%,68%)` : "2px solid #D7E0FF",
              opacity: locked ? 0.35 : 1, transition:"all 0.3s",
              boxShadow: found ? `0 0 10px hsl(${h},75%,55%)55` : "none",
            }}>
              {found ? "✓ " : locked ? "🔒 " : ""}{h}°
            </div>
          );
        })}
      </div>
      {phase === "done" && (
        <button className="anim-pop" onClick={onComplete} style={{
          background:"linear-gradient(135deg,#6366F1,#7C8CFF)", color:"white",
          fontFamily:"var(--font-display)", fontWeight:700, fontSize:17,
          padding:"14px 0", borderRadius:14, boxShadow:"0 6px 24px rgba(99,102,241,0.35)", width:"100%",
        }}>Next Level →</button>
      )}
    </>
  );

  return (
    <LevelWrapper
      icon="🎨" title={hardMode ? "Color Wheel — Hard Mode" : "The Color Wheel"} hardMode={hardMode}
      description={hardMode
        ? "This 24-color wheel has more segments and subtler relationships. Identify the primary colors (evenly spaced) then the secondaries between them."
        : "The color wheel organises all colors in a circle. Start by identifying the 3 primary colors, then find the 3 secondary colors made by mixing them."}
      bullets={hardMode
        ? ["3 primaries are evenly spaced (+20 pts each)", "3 secondaries sit between them (+15 pts each)"]
        : ["Red, Yellow, Blue are primary (+20 pts each)", "Orange, Blue-Green, Violet are secondary (+15 pts each)"]}
    >
      <GameLayout narratorTitle={nc.title}
        narratorText={phase === "primary"
          ? "Primary colors are the origin of every other color — they can't be created by mixing."
          : phase === "secondary"
          ? "Secondary colors are made by mixing two primaries together."
          : "You've identified all the foundation colors — the building blocks of color theory!"}
        narratorHint={nc.hint}
        sidebarBottom={sidebar}
      >
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {particles.map(p => (
            <div key={p.id} style={{ position:"absolute", width:12, height:12, borderRadius:"50%", background:p.color, animation:"floatUp 0.9s ease forwards", top:"44%", left:"50%", pointerEvents:"none" }} />
          ))}
          <ColorWheel size={440} selected={selected} highlighted={highlighted} onSelect={handleSelect} showLabels wheel={hardMode ? WHEEL_24 : undefined} />
        </div>
      </GameLayout>
    </LevelWrapper>
  );
}
