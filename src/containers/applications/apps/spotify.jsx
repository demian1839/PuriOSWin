import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyCRTA2v_CHMENc8A13uyFmM3fOvEeXHjac",
  authDomain: "test2-360ff.firebaseapp.com",
  databaseURL: "https://test2-360ff-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test2-360ff",
  storageBucket: "test2-360ff.firebasestorage.app",
  messagingSenderId: "610633014156",
  appId: "1:610633014156:web:5fd6edf83f0e7e2f6554a9",
  measurementId: "G-J2TJEP9C4C"
};

// --- Firebase Init (sicherstellen, dass es nur einmal gestartet wird) ---
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// --- Logging Funktion ---
async function logEvent(username, action) {
  const timestamp = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  await push(ref(db, "logs"), {
    username,
    action,
    timestamp,
  });
}

// --- Hauptkomponente ---
export default function LoginPortal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("login"); // login | student | teacher

  const handleLogin = () => {
    if (username === "demgoe10" && password === "Demian2010") {
      logEvent(username, "angemeldet");
      setView("student");
    } else if (username === "lehrer2025" && password === "1313") {
      logEvent(username, "angemeldet");
      setView("teacher");
    } else {
      alert("❌ Falscher Benutzername oder Passwort");
    }
  };

  const handleLogout = () => {
    logEvent(username, "abgemeldet");
    setView("login");
    setUsername("");
    setPassword("");
  };

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

  if (view === "teacher") {
    return <TeacherDashboard onLogout={handleLogout} />;
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

// --- Lehrer Dashboard ---
function TeacherDashboard({ onLogout }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logsRef = ref(db, "logs");
    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data);
        arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(arr);
      }
    });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">👨‍🏫 Lehrer Dashboard</h1>
        <button
          onClick={onLogout}
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
                {log.timestamp} – {log.username} hat sich {log.action}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
