// Extracts the visible text of every prerendered page and greps it for placeholder strings.
import fs from "node:fs";
import path from "node:path";
const root = ".next/server/app";
const files = fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith(".html")).map((f) => path.join(root, f));
const pattern = /placeholder|lorem|TODO|TBD|CONTENT_NEEDED|coming soon|pending|\[|example\.com|555-/i;
let hits = 0;
for (const f of files) {
  const html = fs.readFileSync(f, "utf8")
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ");
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|content)="([^"]*)"/g)].map((m) => m[1]);
  const text = html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ");
  for (const chunk of [text, ...attrs]) {
    const m = chunk.match(pattern);
    if (m) { hits++; console.log(`${f}: "${chunk.slice(Math.max(0, m.index - 40), m.index + 40)}"`); }
  }
}
console.log(`${files.length} pages scanned, ${hits} placeholder hits`);
process.exitCode = hits ? 1 : 0;
