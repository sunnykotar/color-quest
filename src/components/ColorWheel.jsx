<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
=======
import React, { useState } from "react";
>>>>>>> a603166218eaf0e648579cb8ea244f528a748be5

/* ── 12-segment standard wheel ─────────────────────────────────────────
   Segments are evenly spaced visually (each = 30° of arc).
   RYB primaries sit at exactly indices 0, 4, 8 — equal 4-step gaps.
   Secondaries sit between primaries at indices 2, 6, 10.
   Tertiaries fill the remaining even gaps at indices 1, 3, 5, 7, 9, 11.

   HSL hue values are chosen to look like traditional painter's wheel
   colors while landing on exact 30° visual slots.                    */
export const WHEEL = [
  { name:"Red",           hue:0,   type:"primary"   },  // idx 0  — primary
  { name:"Red-Orange",    hue:22,  type:"tertiary"  },  // idx 1
  { name:"Orange",        hue:38,  type:"secondary" },  // idx 2  — secondary
  { name:"Yellow-Orange", hue:52,  type:"tertiary"  },  // idx 3
  { name:"Yellow",        hue:60,  type:"primary"   },  // idx 4  — primary ✓
  { name:"Yellow-Green",  hue:90,  type:"tertiary"  },  // idx 5
  { name:"Green",         hue:135, type:"secondary" },  // idx 6  — secondary
  { name:"Blue-Green",    hue:165, type:"tertiary"  },  // idx 7
  { name:"Blue",          hue:220, type:"primary"   },  // idx 8  — primary ✓
  { name:"Blue-Violet",   hue:248, type:"tertiary"  },  // idx 9
  { name:"Violet",        hue:270, type:"secondary" },  // idx 10 — secondary
  { name:"Red-Violet",    hue:330, type:"tertiary"  },  // idx 11
];

/* ── 24-segment hard-mode wheel — real color names, not degree numbers ─
   Evenly spaced at 15° intervals with descriptive names.           */
export const WHEEL_24 = [
  { name:"Red",          hue:0,   type:"primary"   },
  { name:"Red+",         hue:15,  type:"tertiary"  },
  { name:"Red-Orange",   hue:30,  type:"tertiary"  },
  { name:"Orange",       hue:45,  type:"secondary" },
  { name:"Amber",        hue:60,  type:"tertiary"  },
  { name:"Yellow",       hue:75,  type:"primary"   },
  { name:"Yellow",       hue:90,  type:"primary"   },
  { name:"Yellow-Green", hue:105, type:"tertiary"  },
  { name:"Lime",         hue:120, type:"secondary" },
  { name:"Green",        hue:135, type:"primary"   },
  { name:"Teal-Green",   hue:150, type:"tertiary"  },
  { name:"Teal",         hue:165, type:"secondary" },
  { name:"Cyan",         hue:180, type:"tertiary"  },
  { name:"Sky",          hue:195, type:"tertiary"  },
  { name:"Cerulean",     hue:210, type:"secondary" },
  { name:"Blue",         hue:225, type:"primary"   },
  { name:"Royal Blue",   hue:240, type:"tertiary"  },
  { name:"Blue-Violet",  hue:255, type:"tertiary"  },
  { name:"Violet",       hue:270, type:"secondary" },
  { name:"Purple",       hue:285, type:"tertiary"  },
  { name:"Magenta",      hue:300, type:"secondary" },
  { name:"Red-Violet",   hue:315, type:"tertiary"  },
  { name:"Crimson",      hue:330, type:"tertiary"  },
  { name:"Rose",         hue:345, type:"tertiary"  },
];

export const SEGMENTS = WHEEL;

export function indexOfHue(hue, wheel = WHEEL) {
  return wheel.findIndex(s => s.hue === hue);
}

export function isAnalogous(hues, wheel = WHEEL) {
  if (hues.length !== 3) return false;
  const idxs = hues.map(h => indexOfHue(h, wheel)).sort((a, b) => a - b);
  if (idxs.includes(-1)) return false;
  if (idxs[1] === idxs[0] + 1 && idxs[2] === idxs[1] + 1) return true;
  const [a, b, c] = idxs;
  const w = [a + wheel.length, b, c].sort((x, y) => x - y);
  return w[1] === w[0] + 1 && w[2] === w[1] + 1;
}

export function isComplementary(hueA, hueB, wheel = WHEEL) {
  const iA = indexOfHue(hueA, wheel), iB = indexOfHue(hueB, wheel);
  if (iA === -1 || iB === -1) return false;
  return Math.abs(iA - iB) === wheel.length / 2;
}

/* isTriadic: three hues that are exactly N/3 steps apart on the wheel
   (4 apart on a 12-seg wheel, 8 apart on a 24-seg wheel).          */
export function isTriadic(hues, wheel = WHEEL) {
  if (hues.length !== 3) return false;
  const idxs = hues.map(h => indexOfHue(h, wheel));
  if (idxs.includes(-1)) return false;
  const sorted = [...idxs].sort((a, b) => a - b);
  const N = wheel.length;
  const step = N / 3;
  // Check all three rotational gap combinations
  const gaps = [
    sorted[1] - sorted[0],
    sorted[2] - sorted[1],
    N - sorted[2] + sorted[0],
  ];
  return gaps.every(g => Math.round(g) === Math.round(step));
}

/* ── Geometry helpers ───────────────────────────────────────────────
   polar(): converts our "0° = 12-o'clock, clockwise" angle into SVG
   x,y coordinates. The -90 shifts the standard math convention so
   that angle=0 → top of circle.                                   */
function polar(angleDeg, r) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

function slicePath(midDeg, stepDeg, r) {
  const s = polar(midDeg - stepDeg / 2, r);
  const e = polar(midDeg + stepDeg / 2, r);
  return `M 0 0 L ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y} Z`;
}

export default function ColorWheel({
  size        = 300,
  selected    = [],
  highlighted = [],
  dimmed      = [],
  wrongHues   = [],
  onSelect,
  showLabels  = true,
  wheel       = WHEEL,
}) {
  const [hovered, setHovered] = useState(null);
<<<<<<< HEAD
  const containerRef = useRef(null);
  const [resolvedSize, setResolvedSize] = useState(size);

  /* Clamp the wheel size to its container width on resize (mobile). */
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const available = containerRef.current.parentElement?.clientWidth ?? window.innerWidth;
      // On mobile leave 28px breathing room; never exceed the prop size
      const clamped = Math.min(size, Math.max(200, available - 28));
      setResolvedSize(clamped);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [size]);

  const S = resolvedSize;
  const totalSegments = wheel.length;
  const R        = S * 0.46;
  const capR     = S * 0.068;
  const stepDeg  = 360 / totalSegments;
  const is24     = totalSegments > 12;
  /* Font scales down for 24 segments so labels fit in narrower slices */
  const fontSize = is24 ? S * 0.024 : S * 0.036;
=======

  const totalSegments = wheel.length;
  const R        = size * 0.46;
  const capR     = size * 0.068;
  const stepDeg  = 360 / totalSegments;
  const is24     = totalSegments > 12;
  /* Font scales down for 24 segments so labels fit in narrower slices */
  const fontSize = is24 ? size * 0.024 : size * 0.036;
>>>>>>> a603166218eaf0e648579cb8ea244f528a748be5

  return (
    /* Outer div is a plain flex-centred box — NOT a .wheel-container
       because GameLayout's right column already provides that class. */
<<<<<<< HEAD
    <div
      ref={containerRef}
      style={{ position:"relative", flexShrink:0, display:"inline-flex", alignItems:"center", justifyContent:"center" }}
    >
=======
    <div style={{ position:"relative", flexShrink:0, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
>>>>>>> a603166218eaf0e648579cb8ea244f528a748be5

      {/* Subtle radial glow behind the wheel */}
      <div style={{
        position:"absolute",
        inset: -16,
        borderRadius:"50%",
        background:"radial-gradient(circle, rgba(130,120,255,0.09) 0%, transparent 62%)",
        pointerEvents:"none",
        zIndex:0,
      }} />

      <svg
<<<<<<< HEAD
        width={S}
        height={S}
        viewBox={`${-S / 2} ${-S / 2} ${S} ${S}`}
=======
        width={size}
        height={size}
        viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
>>>>>>> a603166218eaf0e648579cb8ea244f528a748be5
        style={{ display:"block", overflow:"visible", position:"relative", zIndex:1 }}
      >
        {wheel.map((seg, index) => {
          /* midDeg: centre angle of this slice in our "0°=top, CW" system */
          const midDeg = (index / totalSegments) * 360;

          const isSel   = selected.includes(seg.hue);
          const isHigh  = highlighted.includes(seg.hue);
          const isWrong = wrongHues.includes(seg.hue);
          const isHov   = hovered === seg.hue && !!onSelect;
          const isDim   = dimmed.includes(seg.hue);

          /* Selected/hovered slices pop outward */
          const outerR = isSel ? R * 1.09 : isHov ? R * 1.04 : R;

          /* Clean, lightweight filters — no heavy coloured glow */
          let filter = "none";
          if (isWrong)     filter = "brightness(0.68) sepia(1) saturate(4) hue-rotate(-30deg)";
          else if (isSel)  filter = "drop-shadow(0 6px 14px rgba(0,0,0,0.18))";
          else if (isHigh) filter = "drop-shadow(0 4px 8px rgba(0,0,0,0.13))";
          else if (isHov)  filter = "brightness(1.10)";
          else if (isDim)  filter = "brightness(0.50) saturate(0.28)";

          /* ── Label position ───────────────────────────────────────────
             We compute x,y via polar() — the SAME function used for the
             slice paths — so the label lands exactly at the visual centre
             of each slice at 65% of the outer radius.

             polar() already applies the -90° offset that makes angle=0
             point to 12-o'clock, so there is no coordinate-system mismatch.

             The <text> element is placed at (x, y) with no rotation, so
             all glyphs remain perfectly horizontal and readable.        */
          const labelRadius = outerR * 0.65;
          const lp          = polar(midDeg, labelRadius);
          const showLabel   = (isSel || isHigh) && showLabels;

          return (
            <g
              key={seg.hue}
              className="slice"
              style={{ cursor: onSelect ? "pointer" : "default" }}
              onClick={() => onSelect && onSelect(seg)}
              onMouseEnter={() => setHovered(seg.hue)}
              onMouseLeave={() => setHovered(null)}
            >
              <path
                d={slicePath(midDeg, stepDeg, outerR)}
                fill={`hsl(${seg.hue}, 85%, 60%)`}
                stroke="none"
                className={isSel || isHigh ? "slice-active" : ""}
                style={{ filter, transition:"filter 0.2s ease" }}
              />

              {showLabel && (
                /* Text placed at polar(midDeg, labelRadius) with no rotation.
                   paintOrder="stroke" draws the shadow-outline behind the fill
                   so the white text stays legible on any hue.              */
                <text
                  x={lp.x}
                  y={lp.y}
                  className="slice-label"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={fontSize}
                  fontFamily="var(--font-body)"
                  fontWeight="600"
                  paintOrder="stroke"
                  stroke="rgba(0,0,0,0.42)"
                  strokeWidth={is24 ? 1.8 : 2.4}
                  strokeLinejoin="round"
                >
                  {seg.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Centre white cap */}
        <circle cx={0} cy={0} r={capR} fill="white" stroke="#D7E0FF" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
