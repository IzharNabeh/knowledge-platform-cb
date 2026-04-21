import http from "http";
const port = 8787;

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/chat") {
    try {
      const authHeader = req.headers.authorization || "";
      const payload = await readJson(req);
      const userName =
        payload?.context?.user?.displayName ||
        payload?.context?.user?.userId ||
        "Authenticated user";

      const answer = [
        `Hello ${userName}.`,
        authHeader
          ? "I received an Authorization header from the host application."
          : "No Authorization header was sent by the host application.",
        `You asked: "${payload.message || ""}"`,
        "This is a mock local response. Replace this server with your real AI backend when ready."
      ].join(" ");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          conversationId: payload.conversationId || "local-conversation-1",
          answer,
          citations: [],
          suggestions: []
        })
      );
      return;
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid request",
          details: error.message
        })
      );
      return;
    }
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "mock-ai-server" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`Mock AI server running at http://localhost:${port}`);
});
