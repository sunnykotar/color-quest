import React, { useState } from "react";
import GameLayout   from "../GameLayout.jsx";
import LevelWrapper from "../LevelWrapper.jsx";

const HUES_NORMAL = [
  { hue:0,   name:"Red"     }, { hue:38,  name:"Orange"  },
  { hue:60,  name:"Yellow"  }, { hue:150, name:"Green"   },
  { hue:210, name:"Blue"    }, { hue:270, name:"Violet"  },
  { hue:305, name:"Magenta" },
];
// Hard mode: more subtle hues (closer together)
const HUES_HARD = [
  { hue:10,  name:"Red+"    }, { hue:25,  name:"R-Orange"}, { hue:45,  name:"Orange+" },
  { hue:80,  name:"Y-Green" }, { hue:180, name:"Cyan"    }, { hue:260, name:"Indigo"  },
  { hue:320, name:"Rose"    },
];

export default function Level4({ onComplete, addPoints, hardMode = false }) {
  const hueOptions = hardMode ? HUES_HARD : HUES_NORMAL;
  // Hard mode: more stops required and narrower lightness spread
  const stopCount = hardMode ? 11 : 9;
  const stopGoal  = hardMode ? 9  : 7;
  const stopToL   = idx => hardMode ? 25 + idx * 5 : 10 + idx * 10;

  const [hue,     setHue]     = useState(hueOptions[4].hue);
  const [sliderL, setSliderL] = useState(55);
  const [visited, setVisited] = useState(() => new Set([hardMode ? 6 : 4]));
  const [done,    setDone]    = useState(false);
  const [awarded, setAwarded] = useState(false);

  const handleSlider = val => {
    const v = Number(val);
    setSliderL(v);
    const lo = stopToL(0), hi = stopToL(stopCount-1);
    const idx = Math.min(stopCount-1, Math.max(0, Math.round((v - lo) / ((hi-lo)/(stopCount-1)))));
    setVisited(prev => {
      const next = new Set(prev); next.add(idx);
      if (next.size >= stopGoal && !done) {
        setDone(true);
        if (!awarded) { addPoints(50); setAwarded(true); }
      }
      return next;
    });
  };

  const handleHue = h => { setHue(h); setSliderL(55); setVisited(new Set([hardMode ? 6 : 4])); setDone(false); setAwarded(false); };

  const lMin = stopToL(0), lMax = stopToL(stopCount-1);
  const label = sliderL < lMin + (lMax-lMin)*0.35 ? "Shade — dark" : sliderL > lMin + (lMax-lMin)*0.65 ? "Tint — light" : "Base hue";

  const sidebar = (
    <>
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:8 }}>Choose a Hue</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {hueOptions.map(h => (
            <button key={h.hue} onClick={() => handleHue(h.hue)} title={h.name} style={{
              width:36, height:36, borderRadius:"50%", background:`hsl(${h.hue},85%,55%)`,
              border: hue===h.hue ? "3px solid #6366F1" : "3px solid transparent",
              boxShadow: hue===h.hue ? `0 0 0 3px rgba(99,102,241,0.3)` : "none",
              cursor:"pointer", transition:"all 0.18s",
              transform: hue===h.hue ? "scale(1.18)" : "scale(1)",
            }} />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:6 }}>Tints &amp; Shades</div>
        <div style={{ display:"flex", gap:2, borderRadius:10, overflow:"hidden", height:36, border:"1px solid #D7E0FF" }}>
          {Array.from({length:stopCount}, (_,idx) => {
            const l = stopToL(idx);
            const isV = visited.has(idx);
            const isC = Math.abs(sliderL - l) < (lMax-lMin)/(stopCount*1.5);
            return (
              <div key={idx} style={{ flex:1, background:`hsl(${hue},85%,${l}%)`, position:"relative" }}>
                {isV && <div style={{ position:"absolute", top:3, left:"50%", transform:"translateX(-50%)", fontSize:8, color: l<52 ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.4)", fontWeight:900 }}>✓</div>}
                {isC && <div style={{ position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)", width:5, height:5, borderRadius:"50%", background: l<52 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.5)" }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text-muted)", fontWeight:700, marginBottom:5 }}>
          <span>◀ Shades (dark)</span><span>Tints (light) ▶</span>
        </div>
        <input type="range" min={lMin} max={lMax} value={sliderL} onChange={e => handleSlider(e.target.value)}
          style={{ width:"100%", background:`linear-gradient(to right, hsl(${hue},85%,${lMin}%), hsl(${hue},85%,55%), hsl(${hue},85%,${lMax}%))` }} />
        <div style={{ textAlign:"center", marginTop:5, fontSize:12, fontWeight:700, color: done ? "#10b981" : "var(--text-muted)" }}>
          {Math.min(visited.size, stopCount)}/{stopCount} stops {done ? "✓ +50 pts!" : `(${Math.max(0, stopGoal-visited.size)} more needed)`}
        </div>
      </div>

      {done && (
        <button className="anim-pop" onClick={onComplete} style={{
          background:"linear-gradient(135deg, #4F7BFF, #6366F1)", color:"white",
          fontFamily:"var(--font-display)", fontWeight:700, fontSize:17,
          padding:"14px 0", borderRadius:14, boxShadow:"0 6px 24px rgba(99,102,241,0.35)", width:"100%",
        }}>Next Level →</button>
      )}
    </>
  );

  return (
    <LevelWrapper
      icon="🌑" title={hardMode ? "Monochromatic — Hard" : "Monochromatic Colors"} hardMode={hardMode}
      description={hardMode
        ? "Explore more subtle shades and tints — the range is narrower and the stops are closer together. Drag across all stops to complete the level."
        : "One hue, many lightnesses. Darker versions are shades, lighter ones are tints. Drag the slider across all the stops to explore the full range."}
      bullets={[`Explore ${stopGoal}+ out of ${stopCount} stops (+50 pts)`, "Pick different hues to see the range shift", hardMode ? "Narrower range — sharper eye needed" : "From near-black to near-white"]}
    >
      <GameLayout
        narratorTitle={hardMode ? "Subtle Monochromatic" : "Monochromatic Colors"}
        narratorText="Monochromatic palettes use one hue at different lightnesses. They're elegant, versatile, and incredibly popular in modern design."
        narratorHint={!done ? `Drag the slider to visit ${Math.max(0,stopGoal-visited.size)} more stops.` : null}
        sidebarBottom={sidebar}
      >
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{
            width:400, height:400, borderRadius:28,
            background:`hsl(${hue},85%,${sliderL}%)`,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:`0 0 80px hsl(${hue},85%,${sliderL}%)66, var(--shadow-lg)`,
            transition:"background 0.18s, box-shadow 0.18s",
            border:"1px solid rgba(255,255,255,0.35)",
          }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color: sliderL < 52 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.5)" }}>{label}</div>
            <div style={{ fontSize:12, fontWeight:600, color: sliderL < 52 ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)" }}>hsl({hue}, 85%, {sliderL}%)</div>
          </div>
        </div>
      </GameLayout>
    </LevelWrapper>
  );
}
