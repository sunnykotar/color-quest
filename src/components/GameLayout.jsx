/**
 * GameLayout — two-column grid on desktop, single-column stack on mobile.
 *
 * Uses CSS classes (game-layout-grid, game-sidebar, wheel-container) so
 * the media queries in global.css can override layout at ≤ 900px without
 * any JS involvement.
 *
 * Left  (380px / full-width on mobile): Narrator + sidebar controls.
 * Right (1fr  / full-width on mobile): Wheel or visualisation, centred.
 */
import React from "react";
import Narrator from "./Narrator.jsx";

export default function GameLayout({
  narratorTitle,
  narratorText,
  narratorHint,
  sidebarBottom,
  children,
}) {
  return (
    <div className="game-layout-grid">

      {/* ── LEFT / TOP on mobile: narrator + controls ── */}
      <div className="game-sidebar">
        <Narrator title={narratorTitle} text={narratorText} hint={narratorHint} />
        {sidebarBottom}
      </div>

      {/* ── RIGHT / BOTTOM on mobile: wheel or visualisation ── */}
      <div className="wheel-container">
        {children}
      </div>

    </div>
  );
}
