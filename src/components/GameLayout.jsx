/**
 * GameLayout — self-contained two-column grid.
 *
 * Left  (380px fixed): Narrator + sidebarBottom controls.
 * Right (1fr):         Wheel or visualisation, always centred.
 *
 * Fills 100% of its parent's width AND height so the wheel column
 * has real pixel dimensions for the SVG to render inside.
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
        <Narrator title={narratorTitle} text={narratorText} hint={narratorHint} />
        {sidebarBottom}
      </div>

      {/* ── RIGHT: wheel / visualisation, always centred ────────── */}
      <div className="wheel-container">
        {children}
      </div>

    </div>
  );
}
