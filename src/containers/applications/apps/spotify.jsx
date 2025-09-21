import React, { useState } from "react";

/**
 * LoginHeyPuri.jsx (ohne framer-motion)
 *
 * Ein hoch animiertes Login-Portal für "HeyPuri" mit:
 *  - Dynamic Background (animierte Gradients + Blobs + Partikel via CSS)
 *  - Liquid-Glass Card
 *  - Benutzername/Passwort-Login
 *  - Voreinstellung: demgoe10 / Demian2010 (Display: Demian-Jean Götze)
 */

const users = [
  { username: "demgoe10", password: "Demian2010", displayName: "Demian-Jean Götze" },
];

export default function LoginHeyPuri({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const found = users.find((u) => u.username === username.trim());
    if (!found) {
      setError("Unbekannter Benutzername.");
      return;
    }
    if (found.password !== password) {
      setError("Falsches Passwort.");
      return;
    }
    setActiveUser(found);
    setSuccess(true);
    if (onLogin) onLogin(found);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0b12] text-white">
      {/* Hintergrund: animierter Gradient */}
      <div className="pointer-events-none absolute inset-0 animate-gradientShift">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/30 via-fuchsia-500/20 to-blue-600/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* Linke Seite */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Willkommen <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Demian-Jean Götze</span>
            </h1>
            <p className="text-white/70">Willst du dich anmelden?</p>
          </div>

          {/* Rechte Seite */}
          {!success ? (
            <form
              onSubmit={handleSubmit}
              className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-wide">Anmeldung</h2>
                <span className="text-xs text-white/60">HeyPuri Portal</span>
              </div>

              <Field
                label="Benutzername"
                placeholder="z. B. demgoe10"
                value={username}
                onChange={setUsername}
                autoFocus
              />

              <Field
                label="Passwort"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={setPassword}
              />

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="relative mt-2 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-5 py-3 font-semibold tracking-wide text-white shadow-lg hover:scale-[1.01] transition-transform"
              >
                Jetzt anmelden
              </button>

              <div className="mt-4 text-center text-xs text-white/55">
                Voreingestellt: <code className="select-all rounded bg-white/10 px-1">demgoe10</code> / <code className="select-all rounded bg-white/10 px-1">Demian2010</code>
              </div>
            </form>
          ) : (
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-emerald-400/25 bg-emerald-500/15 p-6 backdrop-blur-2xl text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400/20">
                <CheckIcon />
              </div>
              <h3 className="mb-1 text-2xl font-bold">Willkommen zurück!</h3>
              <p className="text-white/70">{activeUser?.displayName ?? "Angemeldet"}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { filter: hue-rotate(0deg) saturate(120%); }
          50% { filter: hue-rotate(30deg) saturate(140%); }
          100% { filter: hue-rotate(0deg) saturate(120%); }
        }
        .animate-gradientShift { animation: gradientShift 14s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", autoFocus = false }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm text-white/70">{label}</label>
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/30 focus:ring-0"
      />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
