import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

/**
 * AboutWin – PuriOS Boot + Credits (animiert)
 * - Bootscreen (~3s) mit Progressbar
 * - Danach Credits (5s)
 * - Danach Auto-Close
 *
 * Hinweise:
 * - Keine i18n-Texte, da „mehr nicht“ explizit gewünscht war.
 * - Nutzt Redux: state.desktop.abOpen (Fallback-Öffnen), state.wallpaper.locked/booted
 * - Setzt localStorage.closeAbout = true, damit es zukünftig übersprungen werden kann wie vorher.
 */
export const AboutWin = () => {
  const { abOpen } = useSelector((state) => state.desktop);
  const { locked, booted } = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();

  // Öffnen wie zuvor, aber respektiere dev-mode & localStorage
  const defaultOpen = useMemo(
    () => (import.meta.env.MODE !== "development") && localStorage.getItem("closeAbout") !== "true",
    []
  );

  const [open, setOpen] = useState(defaultOpen || abOpen);

  // Phasen: "boot" -> "credits" -> "done"
  const [phase, setPhase] = useState("boot");
  const [progress, setProgress] = useState(0);

  // Boot erst starten, wenn entsperrt & gebootet (dein bestehender Logik ähnlich)
  useEffect(() => {
    if (!open) return;
    if (locked || !booted) return;

    if (phase === "boot") {
      // Progress in ~3s auffüllen
      let t = 0;
      const STEP_MS = 60; // smoother
      const totalMs = 3000;
      const steps = Math.ceil(totalMs / STEP_MS);

      const id = setInterval(() => {
        t += 1;
        const p = Math.min(100, Math.round((t / steps) * 100));
        setProgress(p);
        if (p >= 100) {
          clearInterval(id);
          // kleine Pause für Gefühl, dann Credits
          setTimeout(() => setPhase("credits"), 300);
        }
      }, STEP_MS);

      return () => clearInterval(id);
    }

    if (phase === "credits") {
      // 5 Sekunden Credits anzeigen
      const id = setTimeout(() => {
        setPhase("done");
      }, 5000);
      return () => clearTimeout(id);
    }
  }, [open, locked, booted, phase]);

  // Schließen & Redux informieren
  const closeAll = () => {
    localStorage.setItem("closeAbout", "true");
    setOpen(false);
    dispatch({ type: "DESKABOUT", payload: false });
  };

  // Nach Credits automatisch schließen
  useEffect(() => {
    if (phase === "done") {
      closeAll();
    }
  }, [phase]);

  if (!open) return null;

  return (
    <div className="aboutApp floatTab dpShad puri-wrap">
      <style>{css}</style>

      {/* Dynamischer Hintergrund */}
      <div className="puri-bg" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grain" />
      </div>

      {/* Inhalt je nach Phase */}
      {phase === "boot" && (
        <div className="puri-center">
          <div className="logo">
            <span className="brand">Puri</span>
            <span className="os">OS</span>
          </div>

          <div className="sub">wird gestartet …</div>

          <div className="bar">
            <div
              className="fill"
              style={{ width: `${progress}%` }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              role="progressbar"
            />
            <div className="shine" />
          </div>

          <div className="ticks">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className={`tick t${i}`} />
            ))}
          </div>
        </div>
      )}

      {phase === "credits" && (
        <div className="puri-center credits">
          <div className="heart-burst" aria-hidden="true">♥</div>
          <div className="made">Gemacht mit Herz.</div>
          <div className="names">Von Demian Götze, Elias Hoffmann, Andy Rick</div>
        </div>
      )}
    </div>
  );
};

/* ===================== Styles (reines CSS) ===================== */
const css = `
/* Google Fonts sauber einbinden */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@400;600&display=swap');

.puri-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: transparent;
  width: clamp(320px, 66vw, 880px);
  height: clamp(260px, 50vh, 520px);
  display: grid;
  place-items: center;
  user-select: none;
}

/* Animated Gradient Background */
.puri-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, #101735, #1a2050, #2a2d6e 60%, #5c4bb6, #8a66ff);
  background-size: 200% 200%;
  animation: gradientShift 18s ease-in-out infinite;
  filter: saturate(1.15) contrast(1.05);
}

@keyframes gradientShift {
  0% { background-position: 0% 30%; }
  50% { background-position: 100% 70%; }
  100% { background-position: 0% 30%; }
}

/* Weiche, schwebende Blobs */
.blob {
  position: absolute;
  width: 40vmax; height: 40vmax;
  border-radius: 50%;
  filter: blur(60px) opacity(0.35);
  mix-blend-mode: screen;
}
.blob.b1 { background: radial-gradient(closest-side, #4d9bff, transparent 65%);
  top: -10vmax; left: -10vmax; animation: float1 22s ease-in-out infinite; }
.blob.b2 { background: radial-gradient(closest-side, #b38cff, transparent 65%);
  bottom: -12vmax; right: -8vmax; animation: float2 26s ease-in-out infinite; }

@keyframes float1 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(5vmax, 3vmax) } }
@keyframes float2 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-4vmax, -2vmax) } }

/* leichte Körnung für Tiefe */
.grain {
  position: absolute; inset: -20%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/ filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: .18; mix-blend-mode: overlay; pointer-events: none;
}

/* Inhalt zentriert */
.puri-center {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  gap: 18px;
  padding: 32px;
  text-align: center;
}

/* PuriOS Logo */
.logo {
  display: inline-flex;
  align-items: baseline;
  gap: .25ch;
  font-family: "Outfit", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  letter-spacing: 0.5px;
  line-height: 1;
  filter: drop-shadow(0 6px 24px rgba(118, 90, 255, .35));
  animation: popIn 700ms cubic-bezier(.2,.9,.2,1) both;
}
.brand {
  font-weight: 800;
  font-size: clamp(32px, 6vw, 64px);
  background: linear-gradient(90deg, #d6e4ff, #ffffff 40%, #c1b4ff 80%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: .5px;
}
.os {
  font-weight: 800;
  font-size: clamp(28px, 5.5vw, 56px);
  background: linear-gradient(90deg, #8cc0ff, #b492ff 60%, #f0eaff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Untertitel */
.sub {
  font-family: "Outfit", system-ui, sans-serif;
  font-weight: 400;
  font-size: clamp(12px, 1.8vw, 16px);
  color: rgba(240,240,255,.85);
  letter-spacing: .3px;
  animation: fadeUp 900ms .2s ease both;
}

/* Progressbar */
.bar {
  width: min(520px, 72vw);
  height: 12px;
  background: rgba(255,255,255,.15);
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.15), 0 6px 24px rgba(18, 20, 60, .35);
  animation: fadeUp 900ms .25s ease both;
}
.fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #7aa8ff, #a48cff, #d6c8ff);
  box-shadow: 0 0 18px rgba(164,140,255,.55);
  transform-origin: left center;
  transition: width 180ms ease-out;
}
.shine {
  position: absolute; inset: 0;
  background-image: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.18) 40%, transparent 70%);
  background-size: 200% 100%;
  animation: shine 2.2s linear infinite;
  pointer-events: none;
}
@keyframes shine {
  0% { background-position: -120% 0; }
  100% { background-position: 120% 0; }
}

/* kleine Lauf-Ticks darunter */
.ticks {
  display: flex; gap: 8px; margin-top: 8px;
}
.tick {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,.28);
  opacity: .3;
  animation: tick 1200ms ease-in-out infinite;
}
${Array.from({length:6}).map((_,i)=>`.tick.t${i}{animation-delay:${i*120}ms}`).join("\n")}
@keyframes tick {
  0%,100% { transform: translateY(0); opacity:.35 }
  50%     { transform: translateY(-6px); opacity:.85 }
}

/* Credits */
.credits {
  gap: 10px;
  animation: fadeIn 600ms ease both;
}
.heart-burst {
  font-size: clamp(22px, 4vw, 36px);
  color: #ffd1f0;
  text-shadow: 0 0 24px rgba(255, 140, 200, .6);
  animation: pulse 900ms ease-in-out infinite;
}
.made {
  font-family: "Outfit", system-ui, sans-serif;
  font-weight: 600;
  font-size: clamp(18px, 3vw, 28px);
  color: #ffffff;
  letter-spacing: .4px;
  animation: slideY 700ms 80ms cubic-bezier(.2,.9,.2,1) both;
}
.names {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: clamp(12px, 2.2vw, 16px);
  color: rgba(235,235,255,.9);
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.16);
  padding: 10px 14px;
  border-radius: 12px;
  backdrop-filter: blur(6px);
  animation: slideY 700ms 180ms cubic-bezier(.2,.9,.2,1) both;
}

/* Keyframes helper */
@keyframes popIn { from { transform: translateY(12px) scale(.98); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
@keyframes fadeUp { from { transform: translateY(10px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideY { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
@keyframes pulse { 0%,100%{ transform: scale(1)} 50%{ transform: scale(1.18)} }
`;

