/**
 * GameLayout — two-column grid on desktop, single-column stack on mobile.
 *
 * Uses CSS classes (game-layout-grid, game-sidebar, wheel-container) so
 * the media queries in global.css can override layout at ≤ 900px.
 *
 * Desktop: Left (380px) = Narrator + sidebar. Right (1fr) = Wheel.
 * Mobile:  Narrator/sidebar on top, wheel/content below.
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

      {/* TOP on mobile / LEFT on desktop: narrator + controls */}
      <div className="game-sidebar">
        <Narrator title={narratorTitle} text={narratorText} hint={narratorHint} />
        {sidebarBottom}
      </div>

      {/* BOTTOM on mobile / RIGHT on desktop: wheel or content */}
      <div className="wheel-container">
        {children}
      </div>

    </div>
  );
}
