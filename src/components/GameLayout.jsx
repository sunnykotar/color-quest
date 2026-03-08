/**
<<<<<<< HEAD
 * GameLayout — two-column grid on desktop, single-column stack on mobile.
 *
 * Uses CSS classes (game-layout-grid, game-sidebar, wheel-container) so
 * the media queries in global.css can override layout at ≤ 900px without
 * any JS involvement.
 *
 * Left  (380px / full-width on mobile): Narrator + sidebar controls.
 * Right (1fr  / full-width on mobile): Wheel or visualisation, centred.
=======
 * GameLayout — self-contained two-column grid.
 *
 * Left  (380px fixed): Narrator + sidebarBottom controls.
 * Right (1fr):         Wheel or visualisation, always centred.
 *
 * Fills 100% of its parent's width AND height so the wheel column
 * has real pixel dimensions for the SVG to render inside.
>>>>>>> a603166218eaf0e648579cb8ea244f528a748be5
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
<<<<<<< HEAD
    <div className="game-layout-grid">

      {/* ── LEFT / TOP on mobile: narrator + controls ── */}
      <div className="game-sidebar">
=======
    <div style={{
      /* Fill whatever parent gives us */
      width: "100%",
      height: "100%",
      minHeight: 0,

      /* Two-column layout */
      display: "grid",
      gridTemplateColumns: "380px 1fr",
      gridTemplateRows: "1fr",
      gap: "36px",
      alignItems: "center",
    }}>

      {/* ── LEFT: narrator + controls ───────────────────────────── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minWidth: 0,
        height: "100%",
        maxHeight: "calc(100vh - 130px)",
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: 4,
        justifyContent: "center",
        alignSelf: "center",
      }}>
>>>>>>> a603166218eaf0e648579cb8ea244f528a748be5
        <Narrator title={narratorTitle} text={narratorText} hint={narratorHint} />
        {sidebarBottom}
      </div>

<<<<<<< HEAD
      {/* ── RIGHT / BOTTOM on mobile: wheel or visualisation ── */}
=======
      {/* ── RIGHT: wheel / visualisation, always centred ────────── */}
>>>>>>> a603166218eaf0e648579cb8ea244f528a748be5
      <div className="wheel-container">
        {children}
      </div>

    </div>
  );
}
