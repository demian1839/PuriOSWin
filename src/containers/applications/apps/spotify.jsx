import React, { useState } from "react";

// --- Hauptkomponente ---
export default function LoginPortal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("login"); // login | student | teacher
  const [logs, setLogs] = useState([]);

  const addLog = (user, action) => {
    const timestamp = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
    setLogs((prev) => [{ timestamp, user, action }, ...prev]);
  };

  const handleLogin = () => {
    if (username === "demgoe10" && password === "Demian2010") {
      addLog(username, "angemeldet");
      setView("student");
    } else if (username === "lehrer2025" && password === "1313") {
      addLog(username, "angemeldet");
      setView("teacher");
    } else {
      alert("❌ Falscher Benutzername oder Passwort");
    }
  };

  const handleLogout = () => {
    addLog(username, "abgemeldet");
    setView("login");
    setUsername("");
    setPassword("");
  };

  // --- Schüleransicht ---
  if (view === "student") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 text-white">
        <h1 className="text-3xl mb-6">👋 Willkommen Schüler {username}</h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 rounded shadow-lg hover:bg-red-700 transition"
        >
          Abmelden
        </button>
      </div>
    );
  }

  // --- Lehreransicht ---
  if (view === "teacher") {
    return (
      <div className="h-screen flex flex-col bg-gray-900 text-white">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">👨‍🏫 Lehrer Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
          >
            Abmelden
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-400">Noch keine Logins vorhanden...</p>
          ) : (
            <ul className="space-y-2">
              {logs.map((log, i) => (
                <li key={i} className="bg-gray-800 p-3 rounded">
                  {log.timestamp} – {log.user} hat sich {log.action}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // --- Login Ansicht ---
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-black">
      <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          🔑 HeyPuri Login
        </h2>
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-600 rounded shadow-lg hover:bg-blue-700 transition text-white font-semibold"
        >
          Jetzt anmelden
        </button>
        <p className="text-xs text-gray-400 mt-4">
          Voreingestellt: <b>demgoe10 / Demian2010</b> (Schüler) oder{" "}
          <b>lehrer2025 / 1313</b> (Lehrer)
        </p>
      </div>
    </div>
  );
}
