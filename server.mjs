import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4175);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const file = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
  const target = resolve(root, file);

  if (!target.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }

  try {
    const data = await readFile(target);
    res.writeHead(200, { "content-type": types[extname(target)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}`);
});
