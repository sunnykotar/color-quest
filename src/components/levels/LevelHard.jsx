/**
 * LevelHard — Hard mode sub-level router.
 *
 * New order matches normal LEVELS:
 *   1. Color Wheel        → hardMode=true
 *   2. Complementary      → hardMode=true (7s timer, 24-seg)
 *   3. Triadic            → hardMode=true (7s timer, 24-seg)
 *   4. Analogous          → hardMode=true (4 neighbors, 7s timer)
 *   5. Monochromatic      → hardMode=true (subtler shades)
 *   6. RGB Light Lab      → hardMode=true (tighter Δ)
 *   7. Scheme Detective   → hardMode=false (same)
 *   8. Fix the Palette    → hardMode=false (same)
 *   9. Memory Challenge   → hardMode=true  (10s question timer)
 */
import React, { useState } from "react";
import Level1       from "./Level1.jsx";
import Level3       from "./Level3.jsx";
import LevelTriadic from "./LevelTriadic.jsx";
import Level2       from "./Level2.jsx";
import Level4       from "./Level4.jsx";
import Level5       from "./Level5.jsx";
import Level6       from "./Level6.jsx";
import Level7       from "./Level7.jsx";
import Level8       from "./Level8.jsx";

const LEVELS     = [Level1, Level3, LevelTriadic, Level2, Level4, Level5, Level6, Level7, Level8];
const HARD_FLAGS = [true,   true,   true,         true,   true,   true,   false,  false,  true];

export default function LevelHard({ onComplete, addPoints }) {
  const [idx, setIdx] = useState(0);

  const handleSubComplete = () => {
    if (idx + 1 >= LEVELS.length) { onComplete(); }
    else { setIdx(i => i + 1); }
  };

  const Comp   = LEVELS[idx];
  const isHard = HARD_FLAGS[idx];

  return (
    <Comp
      key={idx}
      onComplete={handleSubComplete}
      addPoints={addPoints}
      hardMode={isHard}
    />
  );
}
