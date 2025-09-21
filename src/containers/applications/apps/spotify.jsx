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
  const [smile, setSmile] = useState(false);

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
    setSmile(true);
    setTimeout(() => setSmile(false), 1500);
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

      <div className="windowScreen relative overflow-hidden flex flex-col items-center justify-center">
        {/* Auge oben */}
        <div className="mt-8 mb-6 flex items-center justify-center">
          <div className="relative h-20 w-40 rounded-full bg-white/30 backdrop-blur-2xl border border-white/40 overflow-hidden flex items-center justify-center">
            {!smile ? (
              <div
                className="relative h-10 w-10 rounded-full bg-black"
                style={{ transform: `translate(${pupilX}px,${pupilY}px)` }}
              >
                <div
                  className={`absolute inset-1 rounded-full bg-white transition-all ${eyeClosed ? "h-0" : "h-full"}`}
                />
              </div>
            ) : (
              <div className="absolute bottom-4 w-16 h-8 rounded-b-full border-t-4 border-black"></div>
            )}
          </div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/25 bg-white/20 p-6 shadow-2xl backdrop-blur-3xl">
          {!success ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-center text-2xl font-bold mb-6 text-white">Anmeldung</h2>

              <div className="mb-4">
                <label className="mb-1 block text-sm text-white/70">Benutzername</label>
                <input
                  id="hp-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="z. B. demgoe10"
                  className="w-full rounded-xl border border-white/25 bg-white/20 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/40 focus:ring-0"
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
                  className="w-full rounded-xl border border-white/25 bg-white/20 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/40 focus:ring-0"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">{error}</div>
              )}

              <button
                type="submit"
                className="group relative mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-5 py-3 font-semibold tracking-wide text-white shadow-lg transition-transform hover:-translate-y-[1px] active:translate-y-[0px]"
              >
                <span className="relative z-10">🔑 Jetzt anmelden</span>
              </button>

              <p className="mt-4 text-center text-xs text-white/55">
                Voreingestellt: <code className="select-all rounded bg-white/10 px-1">demgoe10</code> / <code className="select-all rounded bg-white/10 px-1">Demian2010</code>
              </p>
            </form>
          ) : (
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-bold text-white">Willkommen zurück!</h3>
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
