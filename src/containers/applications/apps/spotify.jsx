import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LoginHeyPuri.jsx
 *
 * Ein hoch animiertes Login-Portal für "HeyPuri" mit:
 *  - Dynamic Background (animierte Gradients + Blobs + Partikel)
 *  - Liquid-Glass Card
 *  - Benutzername/Passwort-Login mit leicht erweiterbarer Nutzerliste
 *  - Voreinstellung: demgoe10 / Demian2010 (Display: Demian‑Jean Götze)
 *  - Optionales onLogin Callback für App-Integration
 *
 * Verwendung:
 *  <LoginHeyPuri onLogin={(user)=> console.log('Angemeldet:', user)} />
 *
 * Nutzer hinzufügen/ändern:
 *  Passen Sie das users-Array unten an (username, password, displayName).
 */

const users = [
  { username: "demgoe10", password: "Demian2010", displayName: "Demian‑Jean Götze" },
  // Weitere Nutzer hier ergänzen, z. B.:
  // { username: "teacher.goetze", password: "1313", displayName: "Lehrer Götze" },
];

export default function LoginHeyPuri({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [asking, setAsking] = useState(true);

  // Für dezente Ambient-Partikel
  const particles = useMemo(() => new Array(36).fill(0).map((_, i) => ({
    id: i,
    size: 4 + Math.round(Math.random() * 8),
    x: Math.random() * 100,
    y: Math.random() * 100,
    d: 8 + Math.random() * 16,
    t: 6 + Math.random() * 10,
  })), []);

  useEffect(() => {
    // Begrüßungsbildschirm kurz anzeigen
    const tm = setTimeout(() => setAsking(false), 1800);
    return () => clearTimeout(tm);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    setError("");
    const found = users.find(u => u.username === username.trim());
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
    // Optional nach kurzer Animation Callback auslösen
    setTimeout(() => {
      if (onLogin) onLogin(found);
    }, 900);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0b12] text-white">
      {/* Hintergrund: animierter Gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/30 via-fuchsia-500/20 to-blue-600/30 blur-3xl animate-gradientShift" />
        {/* Leuchtende Blobs */}
        <motion.div
          className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl"
          animate={{ x: [0, 40, -20, 0], y: [0, -10, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/25 blur-3xl"
          animate={{ x: [0, -30, 25, 0], y: [0, 30, -15, 0], scale: [1, 0.9, 1.05, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Ambient Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/20 shadow"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float ${p.t}s ease-in-out ${p.id * 0.23}s infinite alternate` ,
              boxShadow: "0 0 12px rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>

      {/* Inhalt */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* Linke Seite: Branding / Welcome */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs tracking-wide text-white/80">HeyPuri • Secure Login</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Willkommen <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Demian‑Jean Götze</span>
            </h1>
            <p className="text-white/70">Willst du dich anmelden?</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/60">
              <Badge>Liquid Glass</Badge>
              <Badge>Animated Gradient</Badge>
              <Badge>Framer Motion</Badge>
              <Badge>Keyboard Ready</Badge>
            </div>
          </motion.div>

          {/* Rechte Seite: Login Card */}
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl"
              >
                {/* Schein / Kantenlicht */}
                <div className="pointer-events-none absolute -inset-px rounded-3xl" style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))",
                  mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                  WebkitMask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: 1,
                }} />

                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-wide">Anmeldung</h2>
                  <span className="text-xs text-white/60">HeyPuri Portal</span>
                </div>

                <Field
                  label="Benutzername"
                  placeholder="z. B. demgoe10"
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
                  withToggle
                  onEnter={handleSubmit}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                  className="group relative mt-2 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-5 py-3 font-semibold tracking-wide text-white shadow-lg"
                >
                  <span className="relative z-10">Jetzt anmelden</span>
                  <span className="absolute inset-0 rounded-2xl opacity-0 blur transition-opacity duration-300 group-hover:opacity-40"
                        style={{ background: "radial-gradient(120px 60px at 50% 0%, rgba(255,255,255,0.6), transparent)" }} />
                </motion.button>

                {/* Quick-Hinweis */}
                <div className="mt-4 text-center text-xs text-white/55">
                  Voreingestellt: <code className="select-all rounded bg-white/10 px-1">demgoe10</code> / <code className="select-all rounded bg-white/10 px-1">Demian2010</code>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-emerald-400/25 bg-emerald-500/15 p-6 backdrop-blur-2xl"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400/20"
                >
                  <CheckIcon />
                </motion.div>
                <h3 className="mb-1 text-center text-2xl font-bold">Willkommen zurück!</h3>
                <p className="text-center text-white/70">
                  {activeUser?.displayName ?? "Angemeldet"}
                </p>
                <div className="pointer-events-none absolute inset-0 animate-pulseGlow" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dekorative Scanning-Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />

      {/* Lokale Keyframes/CSS (funktioniert ohne Tailwind-Config) */}
      <style>{`
        @keyframes float {
          0% { transform: translate3d(0, 0, 0); opacity: .7 }
          100% { transform: translate3d(0, -12px, 0); opacity: 1 }
        }
        @keyframes gradientShift {
          0% { filter: hue-rotate(0deg) saturate(120%); }
          50% { filter: hue-rotate(30deg) saturate(140%); }
          100% { filter: hue-rotate(0deg) saturate(120%); }
        }
        .animate-gradientShift { animation: gradientShift 14s ease-in-out infinite; }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35); }
          50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.0); }
        }
        .animate-pulseGlow { animation: pulseGlow 1.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", autoFocus = false, withToggle = false, onEnter }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm text-white/70">{label}</label>
      <div className="group relative">
        <input
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && onEnter) onEnter(); }}
          type={isPassword && !show ? "password" : "text"}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/30 focus:ring-0"
        />
        {withToggle && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20"
          >
            {show ? "Verbergen" : "Anzeigen"}
          </button>
        )}
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
      {children}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
