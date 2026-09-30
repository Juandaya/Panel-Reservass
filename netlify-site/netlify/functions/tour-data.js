import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });
  const store = getStore("tour-data");

  if (req.method === "GET") {
    const data = await store.get(id, { type: "json" });
    if (!data) return new Response("Tour not found", { status: 404 });
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null);
    if (!body) return new Response("Invalid JSON", { status: 400 });
    await store.setJSON(id, body);
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  }

  return new Response("Method not allowed", { status: 405 });
};
