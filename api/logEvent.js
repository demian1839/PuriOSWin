import { put, list } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const event = req.body;
    const blob = await put(
      `events/${Date.now()}-${event.user}.json`,
      JSON.stringify(event),
      {
        access: "public",
        contentType: "application/json",
      }
    );
    return res.status(200).json({ ok: true, url: blob.url });
  }

  if (req.method === "GET") {
    const { blobs } = await list({ prefix: "events/" });
    const events = await Promise.all(
      blobs.map(async (b) => {
        const r = await fetch(b.url);
        return r.json();
      })
    );
    return res
      .status(200)
      .json(events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  }

  res.status(405).end(); // Methode nicht erlaubt
}
