import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToolBar, Icon } from "../../../utils/general";

/**
 * Spotify.jsx → HeyPuri Login Portal (ohne externe Animations-Bibliotheken)
 *
 * Dieser Component ist drop-in kompatibel mit deinem Web‑OS Window Manager,
 * nutzt weiterhin die Spotify‑App-Slots (state.apps.spotify), rendert aber ein
 * Login‑Portal mit Dynamic Background + Liquid‑Glass Card.
 *
 * Voreinstellung:
 *  - Benutzername: demgoe10
 *  - Passwort:    Demian2010
 *  - Anzeige:     Demian‑Jean Götze
 *
 * Nutzer anpassen: users[] unten erweitern/ändern.
 */

const users = [
  { username: "demgoe10", password: "Demian2010", displayName: "Demian‑Jean Götze" },
  // Weitere Einträge möglich
];

export const Spotify = ({ onLogin }) => {
  const wnapp = useSelector((state) => state.apps.spotify);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    // Fokus beim Öffnen aufs Username-Feld (kleiner Delay bis Window gemountet ist)
    const t = setTimeout(() => {
      const el = document.getElementById("hp-username");
      el?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const u = users.find((x) => x.username === username.trim());
    if (!u) {
      setError("Unbekannter Benutzername.");
      return;
    }
    if (u.password !== password) {
      setError("Falsches Passwort.");
      return;
    }
    setActiveUser(u);
    setSuccess(true);
    // Optional Callback in App integrieren
    if (onLogin) onLogin(u);
  };

  return (
    <div
      className="spotify floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{ ...(wnapp.size === "cstm" ? wnapp.dim : null), zIndex: wnapp.z }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      {/* Titel-/Fensterleiste aus deinem Web‑OS */}
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size} name="HeyPuri • Login" invert />

      {/* Fensterinhalt */}
      <div className="windowScreen relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="pointer-events-none absolute inset-0 animate-hpGradient">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-fuchsia-500/25 to-blue-600/40 blur-3xl" />
          <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl hp-blob" />
          <div className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-blue-500/25 blur-3xl hp-blob2" />
        </div>

        {/* Centered Card */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100%-0px)] max-w-5xl items-center justify-center p-6">
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left: Welcome */}
            <div className="space-y-4 p-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs tracking-wide text-white/80">HeyPuri • Secure</span>
              </div>
              <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
                Willkommen <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Demian‑Jean Götze</span>
              </h1>
              <p className="text-white/70">Willst du dich anmelden?</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-white/60"/>Liquid Glass</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-white/60"/>Animated Gradient</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-white/60"/>Keyboard Ready</span>
              </div>
            </div>

            {/* Right: Card */}
            {!success ? (
              <form
                onSubmit={handleSubmit}
                className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl"
              >
                {/* Subtle edge light */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-3xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))",
                    mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                    WebkitMask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: 1,
                  }}
                />

                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-wide">Anmeldung</h2>
                  <span className="text-xs text-white/60">HeyPuri Portal</span>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm text-white/70">Benutzername</label>
                  <input
                    id="hp-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="z. B. demgoe10"
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/30 focus:ring-0"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm text-white/70">Passwort</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••••"
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/30 focus:ring-0"
                  />
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div>
                )}

                <button
                  type="submit"
                  className="group relative mt-1 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-5 py-3 font-semibold tracking-wide text-white shadow-lg transition-transform hover:translate-y-[-1px] active:translate-y-[0px]"
                >
                  <span className="relative z-10">Jetzt anmelden</span>
                  <span
                    className="absolute inset-0 rounded-2xl opacity-0 blur transition-opacity duration-300 group-hover:opacity-40"
                    style={{ background: "radial-gradient(120px 60px at 50% 0%, rgba(255,255,255,0.6), transparent)" }}
                  />
                </button>

                <div className="mt-4 text-center text-xs text-white/55">
                  Voreingestellt: <code className="select-all rounded bg-white/10 px-1">demgoe10</code> / <code className="select-all rounded bg-white/10 px-1">Demian2010</code>
                </div>
              </form>
            ) : (
              <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-emerald-400/25 bg-emerald-500/15 p-6 text-center backdrop-blur-2xl">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400/20">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="mb-1 text-2xl font-bold">Willkommen zurück!</h3>
                <p className="text-white/70">{activeUser?.displayName ?? "Angemeldet"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Lokale Keyframes, damit's ohne Tailwind-Config läuft */}
        <style>{`
          @keyframes hpGradient {
            0% { filter: hue-rotate(0deg) saturate(120%); }
            50% { filter: hue-rotate(30deg) saturate(140%); }
            100% { filter: hue-rotate(0deg) saturate(120%); }
          }
          .animate-hpGradient { animation: hpGradient 14s ease-in-out infinite; }
          .hp-blob { animation: hpB 18s ease-in-out infinite; }
          .hp-blob2 { animation: hpB2 22s ease-in-out infinite; }
          @keyframes hpB { 0%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(24px,-10px,0) scale(1.08)} 100%{transform:translate3d(0,0,0) scale(1)} }
          @keyframes hpB2 { 0%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(-24px,18px,0) scale(0.94)} 100%{transform:translate3d(0,0,0) scale(1)} }
        `}</style>
      </div>
    </div>
  );
};
