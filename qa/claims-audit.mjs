// Gate 1: every factual claim in rendered copy, metadata, alt text and JSON-LD
// must trace to a Yes row in 11-CLAIMS-REGISTER.md. Forbidden claims must not appear.
import fs from "node:fs";
import path from "node:path";

const root = ".next/server/app";
const files = fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith(".html")).map((f) => path.join(root, f));

const allowed = [
  ["C1", "Business name", /Radiant Events Planning/],
  ["C2", "Tagline", /Planning with Purpose\. Serving with Grace\./],
  ["C3", "Founder", /Rickya Fandino/],
  ["C4", "Planning & coordination offered", /planning|coordination/i],
  ["C5", "Service lines offered", /balloon|backdrop|tablescape|floral|draping|styling|custom design/i],
  ["C6", "Weddings", /wedding/i],
  ["C7", "Events of 5,000 guests", /5,000/],
  ["C8", "Church conferences (generic)", /church conference/i],
  ["C9", "Delivery/setup/installation included", /Delivery, setup, and installation are included/],
  ["C10", "Atlanta area", /Atlanta/],
  ["C11", "Two-business-day reply", /two business days/],
  ["C12", "Portfolio projects", /Sweet 16|Ministry Gathering|Game Night|She Rose/],
];

const forbidden = [
  ["C7 misuse", /5,000\+|5,000 events/i],
  ["C13 prices", /\$\s?\d|\bdeposit\b|\bminimum\b|starting at|\bper person\b/i],
  ["C14 testimonials/ratings", /testimonial|★|\b\d(\.\d)?[ -]stars?\b|rated \d|\breviews\b|client said|customer review/i],
  ["C15 counts/years/awards", /\byears? (in business|of experience)\b|\d+\+? (events|clients|weddings)\b|award/i],
  ["C16 church/scripture", /Victory Church|Scripture|\bverse\b/i],
  ["C17 trademark", /®|™/],
  ["Address", /\d{2,5} [A-Z][a-z]+ (St|Street|Ave|Avenue|Rd|Road|Blvd|Dr|Drive|Lane|Ln|Way)\b/],
  ["Phone", /\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}/],
  ["Email", /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i],
];

const textOf = (html) => {
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const meta = [...html.matchAll(/\s(?:alt|title|aria-label|content)="([^"]*)"/g)].map((m) => m[1]);
  const title = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1]);
  const body = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
  return [body, ...meta, ...title, ...ld].join(" \n ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ");
};

const found = Object.fromEntries(allowed.map(([id]) => [id, new Set()]));
const violations = [];
for (const f of files) {
  const t = textOf(fs.readFileSync(f, "utf8"));
  const page = "/" + path.relative(root, f).replace(/\.html$/, "").replace(/index$/, "");
  for (const [id, , re] of allowed) if (re.test(t)) found[id].add(page);
  for (const [id, re] of forbidden) {
    const m = t.match(re);
    if (m) violations.push(`${id} on ${page}: "…${t.slice(Math.max(0, m.index - 50), m.index + 50)}…"`);
  }
}

console.log("Claims found (all trace to Yes rows in 11-CLAIMS-REGISTER.md):");
for (const [id, label] of allowed) console.log(`  ${id.padEnd(4)} ${label.padEnd(40)} ${found[id].size} page(s)`);
console.log(`\nForbidden-claim scan over ${files.length} pages: ${violations.length} hit(s)`);
violations.forEach((v) => console.log("  ✗ " + v));
process.exitCode = violations.length ? 1 : 0;
