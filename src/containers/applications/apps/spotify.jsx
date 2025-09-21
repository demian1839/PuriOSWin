import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

const users = [
  { username: "demgoe10", password: "Demian2010", displayName: "Demian-Jean Götze" },
];

export const Spotify = ({ onLogin }) => {
  const wnapp = useSelector((state) => state.apps.spotify);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [eyeClosed, setEyeClosed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
    if (onLogin) onLogin(u);
  };

  const eyeCenter = { x: window.innerWidth / 2, y: window.innerHeight / 4 };
  const dx = mousePos.x - eyeCenter.x;
  const dy = mousePos.y - eyeCenter.y;
  const angle = Math.atan2(dy, dx);
  const pupilX = Math.cos(angle) * 10;
  const pupilY = Math.sin(angle) * 10;

  return (
    <div
      className="spotify floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{ ...(wnapp.size === "cstm" ? wnapp.dim : null), zIndex: wnapp.z }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size} name="HeyPuri • Login" invert />

      <div className="windowScreen relative overflow-hidden">
        {/* Hintergrund */}
        <div className="pointer-events-none absolute inset-0 animate-hpGradient">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-fuchsia-500/25 to-blue-600/40 blur-3xl" />
        </div>

        {/* Auge oben */}
        <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2 flex items-center justify-center">
          <div className="relative h-20 w-40 rounded-full bg-white/30 backdrop-blur-2xl border border-white/40 overflow-hidden">
            <div
              className="absolute left-1/2 top-1/2 h-10 w-10 rounded-full bg-black"
              style={{ transform: `translate(-50%,-50%) translate(${pupilX}px,${pupilY}px)` }}
            >
              <div
                className={`absolute inset-1 rounded-full bg-white transition-all ${eyeClosed ? "h-0" : "h-full"}`}
              />
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100%-0px)] max-w-5xl items-center justify-center p-6">
          {!success ? (
            <form
              onSubmit={handleSubmit}
              className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/25 bg-white/20 p-6 shadow-2xl backdrop-blur-3xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-wide text-white">Anmeldung</h2>
                <span className="text-xs text-white/60">HeyPuri Portal</span>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-white/70">Benutzername</label>
                <input
                  id="hp-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="z. B. demgoe10"
                  className="w-full rounded-2xl border border-white/25 bg-white/20 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/40 focus:ring-0"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-white/70">Passwort</label>
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setEyeClosed(e.target.value.length > 0);
                  }}
                  type="password"
                  placeholder="••••••••••"
                  className="w-full rounded-2xl border border-white/25 bg-white/20 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/40 focus:ring-0"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">{error}</div>
              )}

              <button
                type="submit"
                className="group relative mt-1 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-5 py-3 font-semibold tracking-wide text-white shadow-lg transition-transform hover:translate-y-[-1px] active:translate-y-[0px]"
              >
                Jetzt anmelden
              </button>

              <div className="mt-4 text-center text-xs text-white/55">
                Voreingestellt: <code className="select-all rounded bg-white/10 px-1">demgoe10</code> / <code className="select-all rounded bg-white/10 px-1">Demian2010</code>
              </div>
            </form>
          ) : (
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-emerald-400/25 bg-emerald-500/20 p-6 text-center backdrop-blur-3xl">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mb-1 text-2xl font-bold text-white">Willkommen zurück!</h3>
              <p className="text-white/70">{activeUser?.displayName ?? "Angemeldet"}</p>
            </div>
          )}
        </div>

        <style>{`
          @keyframes hpGradient {
            0% { filter: hue-rotate(0deg) saturate(120%); }
            50% { filter: hue-rotate(30deg) saturate(140%); }
            100% { filter: hue-rotate(0deg) saturate(120%); }
          }
          .animate-hpGradient { animation: hpGradient 14s ease-in-out infinite; }
        `}</style>
      </div>
    </div>
  );
};
