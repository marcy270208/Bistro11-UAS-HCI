import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
const root = resolve(process.cwd());
const type = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript",
  ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".ico":"image/x-icon" };
createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/" || rel === "") rel = "/index.html";
  const p = resolve(join(root, rel));
  if (p !== root && !p.startsWith(root + sep)) { res.writeHead(403).end("forbidden"); return; }
  try {
    const f = await readFile(p);
    res.writeHead(200, { "Content-Type": type[extname(p).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store" });
    res.end(f);
  } catch { res.writeHead(404).end("not found"); }
}).listen(4173, () => console.log("serving " + root + " on http://localhost:4173"));
