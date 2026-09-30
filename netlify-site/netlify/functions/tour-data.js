const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id) return { statusCode: 400, body: "Missing id" };
  const store = getStore("tour-data");

  if (event.httpMethod === "GET") {
    const data = await store.get(id, { type: "json" });
    if (!data) return { statusCode: 404, body: "Tour not found" };
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  if (event.httpMethod === "POST") {
    let body = {};
    try { body = JSON.parse(event.body || "{}"); } catch (e) {
      return { statusCode: 400, body: "Invalid JSON" };
    }
    await store.setJSON(id, body);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: "Method not allowed" };
};
