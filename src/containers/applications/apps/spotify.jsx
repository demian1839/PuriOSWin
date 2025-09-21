import React from "react";

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-gray-800 px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">🌐 HeyPuri Portal</h1>
        <span className="text-sm opacity-70">vercel.app</span>
      </header>

      <div className="flex-1">
        <iframe
          src="https://puriloginwin.netlify.app"
          title="HeyPuri Login"
          className="w-full h-full border-none"
        ></iframe>
      </div>
    </div>
  );
}
