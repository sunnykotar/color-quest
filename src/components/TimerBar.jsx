import React, { useEffect, useRef, useState } from "react";

export default function TimerBar({ seconds = 10, onExpire }) {
  const [pct,     setPct]     = useState(100);
  const [expired, setExpired] = useState(false);
  const ivRef  = useRef(null);
  const t0     = useRef(Date.now());

  useEffect(() => {
    t0.current = Date.now();
    const total = seconds * 1000;
    ivRef.current = setInterval(() => {
      const elapsed   = Date.now() - t0.current;
      const remaining = Math.max(0, total - elapsed);
      setPct((remaining / total) * 100);
      if (remaining === 0) {
        clearInterval(ivRef.current);
        setExpired(true);
        onExpire?.();
      }
    }, 40);
    return () => clearInterval(ivRef.current);
  }, []);   // intentionally runs once — caller re-mounts via key prop

  const col = pct > 55 ? "#10b981" : pct > 25 ? "#f59e0b" : "#ef4444";
  const secs = Math.ceil((pct / 100) * seconds);

  return (
    <div style={{ width:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:700, color:"var(--text-muted)", marginBottom:4 }}>
        <span>⏱ Time remaining</span>
        <span style={{ color: col }}>{secs}s</span>
      </div>
      <div style={{ height:8, borderRadius:99, background:"#EEF6FF", border:"1px solid rgba(79,123,255,0.20)", overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:99,
          width:`${pct}%`,
          background:`linear-gradient(90deg,${col},${col}bb)`,
          boxShadow:`0 0 6px ${col}88`,
          transition:"width 0.04s linear, background 0.3s ease",
        }} />
      </div>
      {expired && <div style={{ fontSize:11, color:"#ef4444", fontWeight:700, marginTop:3 }}>⏰ Time's up! −10 pts</div>}
    </div>
  );
}
