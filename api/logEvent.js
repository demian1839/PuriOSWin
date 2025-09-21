import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    // Body auslesen (kommt von login.jsx)
    const { username, action } = JSON.parse(req.body);

    // Zeitstempel erzeugen
    const timestamp = new Date().toLocaleString("de-DE", {
      timeZone: "Europe/Berlin",
    });

    // Log-Zeile vorbereiten
    const logLine = `${timestamp} - ${username} hat sich ${action}\n`;

    // Datei in Vercel Blob schreiben (append = true → anhängen)
    await put("logs/login-events.txt", logLine, {
      access: "public",
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Wichtig: "append" erlaubt, dass mehrere Events in der Datei stehen
      append: true,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("LogEvent Error:", err);
    res.status(500).json({ error: err.message });
  }
}
