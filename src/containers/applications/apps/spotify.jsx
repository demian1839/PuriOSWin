import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import { put, list } from "@vercel/blob";

const users = [
  { username: "demgoe10", password: "Demian2010", displayName: "Demian-Jean Götze", role: "student" },
  { username: "lehrer2025", password: "1313", displayName: "Lehrer Dashboard", role: "teacher" }
];

// --- Logging in Blob DB ---
async function logEvent(user, status) {
  const event = {
    user: user.username,
    role: user.role,
    status, // "login" oder "logout"
    timestamp: new Date().toISOString(),
  };
  await put(`events/${Date.now()}-${user.username}.json`, JSON.stringify(event), {
    access: "public",
    contentType: "application/json",
  });
}

// --- Dashboard ---
async function fetchEvents() {
  const { blobs } = await list({ prefix: "events/" });
  const events = await Promise.all(
    blobs.map(async (b) => {
      const res = await fetch(b.url);
      return res.json();
    })
  );
  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export const Spotify = () => {
  const wnapp = useSelector((state) => state.apps.spotify);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const [events, setEvents] = useState([]);

  const handleSubmit = async (e) => {
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
    await logEvent(u, "login");

    if (u.role === "teacher") {
      const ev = await fetchEvents();
      setEvents(ev);
    }
  };

  const handleLogout = async () => {
    if (activeUser) {
      await logEvent(activeUser, "logout");
    }
    setActiveUser(null);
    setSuccess(false);
    setUsername("");
    setPassword("");
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
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="HeyPuri Portal"
        invert
      />

      <div className="windowScreen relative overflow-hidden flex flex-col items-center justify-center p-6">
        {!success ? (
          <form
            onSubmit={handleSubmit}
            className="relative mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <h2 className="text-center text-2xl font-bold mb-6 text-white">
              Anmeldung
            </h2>

            <div className="mb-4">
              <label className="mb-1 block text-sm text-white/70">
                Benutzername
              </label>
              <input
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
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••••"
                className="w-full rounded-xl border border-white/25 bg-white/20 px-4 py-3 text-base text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-white/40 focus:ring-0"
              />
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-5 py-3 font-semibold tracking-wide text-white shadow-lg"
            >
              🔑 Jetzt anmelden
            </button>
          </form>
        ) : activeUser.role === "teacher" ? (
          <div className="w-full max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-white mb-4">
              Dashboard
            </h2>
            <button
              onClick={async () => setEvents(await fetchEvents())}
              className="mb-4 px-4 py-2 rounded bg-blue-600 text-white"
            >
              🔄 Aktualisieren
            </button>
            <table className="w-full text-white text-sm border-collapse">
              <thead>
                <tr className="bg-white/20">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Rolle</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Zeit</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <tr key={i} className="odd:bg-white/5 even:bg-white/10">
                    <td className="p-2">{e.user}</td>
                    <td className="p-2">{e.role}</td>
                    <td className="p-2">{e.status}</td>
                    <td className="p-2">
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleLogout}
              className="mt-6 px-4 py-2 rounded bg-red-600 text-white"
            >
              🚪 Abmelden
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="mb-2 text-2xl font-bold text-white">
              Willkommen zurück!
            </h3>
            <p className="text-white/70">{activeUser.displayName}</p>
            <button
              onClick={handleLogout}
              className="mt-6 px-4 py-2 rounded bg-red-600 text-white"
            >
              🚪 Abmelden
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
