#!/usr/bin/env node
// Media pipeline for Radiant Events Planning.
//
// Reads originals from _source-media/ (git-ignored, never committed), writes
// web-ready, metadata-free derivatives to public/, and regenerates
// src/content/media-manifest.ts.
//
//   node scripts/process-media.mjs            # process everything available
//   node scripts/process-media.mjs --only E02  # limit to asset IDs with this prefix
//
// Stills: HEIC -> JPEG buffer -> sharp().rotate() -> crop/blur -> strip metadata
//         -> <asset>-{800,1600,2400}.{avif,webp,jpg}   (JPG q80, AVIF q55, WebP q75)
// Videos: ffmpeg -> muted H.264 MP4 + VP9 WebM, <= 1080p long edge, <= 12 s,
//         <= 3 MB each, plus a poster JPG.
//
// Requires ffmpeg on PATH. Source/crop/alt decisions live in ASSETS below and
// are documented in QA-REPORT.md.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import convert from "heic-convert";
import { exiftool } from "exiftool-vendored";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "_source-media");
const OUT_IMG = path.join(ROOT, "public/images/portfolio");
const OUT_VID = path.join(ROOT, "public/video");
const MANIFEST = path.join(ROOT, "src/content/media-manifest.ts");

const WIDTHS = [800, 1600, 2400];
const JPG_Q = 80;
const AVIF_Q = 55;
const WEBP_Q = 75;
const MAX_VIDEO_BYTES = 3 * 1024 * 1024;

/**
 * crop: { aspect: [w, h], left, top, width } — fractions of the rotated source.
 *   `width` is the fraction of source width kept; height follows from aspect.
 * blur: [{ x, y, w, h }] in rotated-source pixels, applied before cropping.
 * variants: extra named crops (hero art direction, OG).
 * driveId: original file in the owner's Drive (05-ASSET-INVENTORY.csv drive_file_id).
 * copyId:  the SOURCE-MEDIA copy that was downloaded (05 source_media_copy_id).
 */
const ASSETS = [
  {
    id: "E01-01", project: "E01", file: "E01-01-hero__IMG_2862.HEIC",
    driveId: "17IOfHla4bmW8wWjDx62F2uBXamZXENGh", copyId: "1UQxyx7aBE_47pPU9e65BBHSie3gm91V6",
    alt: "Pink balloon arch and ribbon fringe backdrop with light-up 16 numbers on a sunny patio",
    crop: { aspect: [4, 5], left: 0, top: 0.03, width: 1 },
    variants: {
      "hero-desktop": { aspect: [3, 2], left: 0, top: 0.16, width: 1, widths: [800, 1600, 2400] },
      "hero-mobile": { aspect: [4, 5], left: 0.08, top: 0.12, width: 0.78, widths: [800, 1200] },
      og: { aspect: [1200, 630], left: 0, top: 0.205, width: 1, widths: [1200], jpgOnly: true },
    },
    notes: "Home hero. Desktop 3:2 and mobile 4:5 keep the full arch and the light-up 16. Foreground shrub trimmed in the 3:2 crop. No people in frame.",
  },
  // E01-02 (IMG_2860) intentionally skipped: an identifiable person is visible
  // through the doorway behind the arch, and the face sits mid-frame so it
  // cannot be cropped out. Sweet 16 guest rule: crop or skip.
  {
    id: "E01-03", project: "E01", file: "E01-03-backdrop-straight__IMG_2855.HEIC",
    driveId: "1orcVrOJuCWI-irqpYHdwa_uGLliy-GRH", copyId: "1Yam8XbBsajBOcqCdd1XklECh87hnm5p3",
    alt: "Ribbon fringe backdrop framed by pink balloons beside light-up 16 numbers",
    crop: { aspect: [4, 5], left: 0, top: 0.04, width: 1 },
    notes: "4:5 straight-on. No people in frame.",
  },
  {
    id: "E01-04", project: "E01", file: "E01-04-backdrop-angle__IMG_2864.HEIC",
    driveId: "1fFYcuj9WxV0yl1Ize6MrobRSDfKJ_BMM", copyId: "1Z9UEg2BlcUQ3OFgnYfN9IVNR305KTj-4",
    alt: "Angled view of a pink balloon arch and ribbon backdrop",
    crop: { aspect: [4, 5], left: 0, top: 0.04, width: 1 },
    notes: "4:5. No people in frame.",
  },
  {
    id: "E01-05", project: "E01", file: "E01-05-arch__IMG_2847.HEIC",
    driveId: "1iQiUcqE5_Ks2IGe6XMnAwi8qEVrmA-SY", copyId: "1pJ9TyJgFZqMcrB-DI_tp0GCp4-GL2HrR",
    alt: "Organic pink balloon arch framing French doors on a stone patio",
    crop: { aspect: [4, 5], left: 0, top: 0.04, width: 1 },
    notes: "4:5. Glass shows only a dark, unidentifiable reflection of the photographer.",
  },
  {
    id: "E01-06", project: "E01", file: "E01-06-arch__IMG_2850.HEIC",
    driveId: "1UvHzAgvGlbmR7gXk465qtTSV0xNr0gJU", copyId: "1zc324wfameMPo-KEv-OuQjr67a9_kNy_",
    alt: "Pink balloon arch in layered shades of pink",
    crop: { aspect: [4, 5], left: 0, top: 0.04, width: 1 },
    notes: "4:5. Glass shows only dark, unidentifiable reflections.",
  },
  {
    id: "E01-07", project: "E01", file: "E01-07-arch-camera__DSCF0168.jpg",
    driveId: "1CDaRGWPyxRazg01QB-_sOabpudo6c8Tu", copyId: "1s74xZ1RJT0qIvXPeJILPBhqoZtXtuZiP",
    alt: "Pink organic balloon arch at a brick doorway",
    crop: { aspect: [4, 5], left: 0, top: 0.08, width: 1 },
    notes: "Source is 2:3 portrait (EXIF orientation 8, rotated). 4:5 crop. No people in frame.",
  },
  {
    id: "E01-08", project: "E01", file: "E01-08-process-install__DSCF0077.jpg",
    driveId: "1JYGTF4fgV4n3ZjTNIGPfzzdxaouXV3ie", copyId: "1z5PnFdsmFZfiu09G3tkpYaaay8SAqD7Z",
    alt: "Pink balloon arch mid-installation with a step ladder beside it",
    crop: { aspect: [4, 5], left: 0, top: 0.12, width: 1 },
    notes: "4:5, crop keeps the step ladder. No people in frame.",
  },
  {
    id: "E01-09", project: "E01", file: "E01-09-balcony-detail__IMG_2846.HEIC",
    driveId: "1A9dWUiLkCHRTPbio7-FbthdtLucZ3VYi", copyId: "1DKxA2wHD2Yp29TjgdZzoEjuxkhm2WhD7",
    alt: "Pink balloon clusters along a balcony railing overlooking trees",
    crop: { aspect: [4, 5], left: 0, top: 0, width: 1 },
    notes: "4:5 detail. No people in frame; no house or street identifiers.",
  },
  {
    id: "E02-01", project: "E02", file: "E02-01-lead__IMG_3434.HEIC",
    driveId: "1FJfnMfqQDyYMp0Hs9AGWbay5t07ak45L", copyId: "1ndQybpXrr59glZAr8oYG5a4ODuaR8K4H",
    alt: "Game-night balloon column with playing cards and oversized dice beside a welcome sign",
    crop: { aspect: [4, 5], left: 0, top: 0.03, width: 1 },
    blur: [{ x: 1680, y: 1826, w: 380, h: 80 }],
    notes: "4:5. Honoree's name on the welcome sign was legible and is blurred.",
  },
  {
    id: "E02-02", project: "E02", file: "E02-02__IMG_3433.HEIC",
    driveId: "1wfPuKVHTI-pAGCyTxOM8N7ipdZ9DU8Yz", copyId: "1Zfpc64wqxps4IOzZFDBMA0uv6BGLhiiZ",
    alt: "Black, silver, purple and pink balloon column with stacked dice",
    crop: { aspect: [4, 5], left: 0, top: 0.03, width: 1 },
    blur: [{ x: 1500, y: 1446, w: 390, h: 82 }],
    notes: "4:5. Honoree's name on the welcome sign was legible and is blurred.",
  },
  {
    id: "E03-01", project: "E03", file: "E03-01-lead__IMG_3765.HEIC",
    driveId: "1TQxWKoKZU3yWkyLYukn-fcOl7WkCUCTU", copyId: "1ryvRy4i-XTRMRaWwTRMy0lkAk0zD6te4",
    alt: "Teal and lime balloon garlands framing a purple shimmer-wall backdrop",
    crop: { aspect: [4, 5], left: 0, top: 0.0625, width: 1 },
    notes: "Manifest asked for 3:2; the source is 3:4 portrait and a 3:2 crop would cut the garlands, so 4:5 with the ceiling trimmed. Panel text is the ministry team name only; no church named.",
  },
  {
    id: "E03-02", project: "E03", file: "E03-02__IMG_3767.HEIC",
    driveId: "11TiTOSgsOX-4MQ_EvO5fd_j_J1TOWYq5", copyId: "16HtrQm3tJQwx9j8zz625SzBJTXWVlmC-",
    alt: "Balloon garlands in teal and lime around a purple sequin wall",
    crop: { aspect: [4, 5], left: 0, top: 0.0625, width: 1 },
    notes: "4:5 with ceiling trimmed (source is portrait; see E03-01).",
  },
  {
    id: "E03-03", project: "E03", file: "E03-03__IMG_3761.HEIC",
    driveId: "1ISgpAesyLAihVgqufn9iL8Jx0aFZ-8Dz", copyId: "1C-Y1hcMwf0v29GcClDTXoo-RM2bECT3K",
    alt: "Close view of teal and lime balloon garland beside a purple panel",
    crop: { aspect: [4, 5], left: 0, top: 0.0625, width: 1 },
    notes: "4:5.",
  },
  {
    id: "E04-01", project: "E04", file: "E04-01-sign-detail__She Rose-153.jpg",
    driveId: "1346Ml8EfD8Xjm1voqMx8vl0VyJW0RMjz", copyId: "1w8ydR4H2I79or67oVi9l8Z8WV9t-wl63",
    alt: "Hot-pink arched table sign on a sequin tablecloth with a gold rose accent",
    crop: { aspect: [4, 5], left: 0, top: 0, width: 1, center: true },
    notes: "4:5 (professional photographer image).",
  },
  {
    id: "E04-02", project: "E04", file: "E04-02-flower-wall__IMG_1683.HEIC",
    driveId: "1hGzpLx4NnRPo2x_3ocNYL8-z_DEUixHG", copyId: "1u4UX5et-3sBJazaZaRiw1fofNArPOfiY",
    alt: "Rose flower wall framing pink sequin panels",
    crop: { aspect: [4, 3], left: 0.08, top: 0.04, width: 0.92 },
    notes: "4:3. Left edge trimmed to remove a partial guest at the frame edge.",
  },
  {
    id: "E04-03", project: "E04", file: "E04-03-signing-table__She Rose-031.jpg",
    driveId: "1iJ0clOEhKKZSHc-1h2W-cwjvp7xuZ3Ne", copyId: "15q_dxagr0arPYVNTjCrYwr7D_QeuEQUq",
    alt: "Author signing table dressed in pink and white linens beneath a welcome banner",
    crop: { aspect: [4, 5], left: 0, top: 0, width: 1, center: true },
    notes: "4:5 (professional photographer image).",
  },
  {
    id: "E04-04", project: "E04", file: "E04-04-napkin-detail__She Rose-024.jpg",
    driveId: "1f45saN0SoTsoSn7stWFFZnSl-HaQd0hG", copyId: "1SLGCSTwPS0kzdad3Jxz2oA3mk2UF1eNI",
    alt: "Branded cocktail napkins on a scalloped plate",
    crop: { aspect: [1, 1], left: 0, top: 0, width: 1, center: true },
    notes: "1:1 detail (professional photographer image).",
  },
];

/**
 * Videos. `start`/`duration` (seconds) are chosen after scrubbing each clip;
 * a clip without a chosen segment is skipped. `posterAt` is relative to start.
 */
const VIDEOS = [
  {
    id: "E01-V1", project: "E01", file: "E01-V1-hero-loop__IMG_2859.MOV",
    driveId: "1Z5GZnkCTeOnbhT1fI6mR1JDmkz0AJAyh", copyId: "1LEbc-kI2h1k0Vi0bnpkiinqbLxSJ0Lqh",
    alt: "", role: "Home hero loop (decorative; poster uses E01-01 alt text)",
    start: null, duration: null, posterAt: 0,
  },
  {
    id: "E01-V2", project: "E01", file: "E01-V2-process-setup__IMG_2835.MOV",
    driveId: "1jLlNXpEMbgi9yHA9kYEqPzm_sb47rluR", copyId: "1mKpXRsB7KCKcsYN6yaKplHrW9C7Vp_TR",
    alt: "Balloon arch being built on a patio", role: "Process page clip",
    start: null, duration: null, posterAt: 0,
  },
  {
    id: "E02-V1", project: "E02", file: "E02-V1__IMG_3444.MOV",
    driveId: "1vvBe8J8VvREByLy_hrw3ftfkDpKMyO1r", copyId: "1wBrP3sLVGQVLqH_5TVeFl5axzwumpHqs",
    alt: "Game-night balloon column with oversized dice", role: "Project video",
    start: null, duration: null, posterAt: 0,
  },
  {
    id: "E03-V1", project: "E03", file: "E03-V1__IMG_3764.MOV",
    driveId: "1qNIgXh6cI-0omdZ1yuouY6DeZ-5gS1VN", copyId: "19osGwhGwgZwYBB3CFAl9gT-PXIsJt50H",
    alt: "Teal and lime balloon cluster detail", role: "Project video",
    start: null, duration: null, posterAt: 0,
  },
  {
    id: "E05-V1", project: "E05", file: "E05-V1-tablescape__IMG_3170.MOV",
    driveId: "11r5JtzYNbJ18Li-JugaX9AMbp9gns9IN", copyId: "154gGfmDSk_eB_4QNtQiA9TQtzb6EwXja",
    alt: "Candlelit tablescape with taper candles and layered chargers", role: "E05 video; poster doubles as E05 hero",
    start: null, duration: null, posterAt: 0, liftExposure: true,
  },
];

// ---------------------------------------------------------------------------

const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const pick = (a) => !only || a.id.startsWith(only);

async function loadRotated(file) {
  let buf = fs.readFileSync(path.join(SRC, file));
  if (/\.heic$/i.test(file)) {
    buf = Buffer.from(await convert({ buffer: buf, format: "JPEG", quality: 0.95 }));
  }
  // rotate() applies EXIF orientation; the output buffer carries no metadata.
  const rotated = await sharp(buf).rotate().toBuffer();
  const meta = await sharp(rotated).metadata();
  return { buf: rotated, width: meta.width, height: meta.height };
}

async function applyBlur(src, regions = []) {
  if (!regions.length) return src.buf;
  const layers = await Promise.all(
    regions.map(async (r) => ({
      input: await sharp(src.buf).extract({ left: r.x, top: r.y, width: r.w, height: r.h }).blur(28).toBuffer(),
      left: r.x,
      top: r.y,
    })),
  );
  return sharp(src.buf).composite(layers).toBuffer();
}

function cropRect(src, c) {
  const width = Math.round(src.width * c.width);
  const height = Math.round((width * c.aspect[1]) / c.aspect[0]);
  const left = Math.round(src.width * c.left);
  let top = c.center ? Math.round((src.height - height) / 2) : Math.round(src.height * c.top);
  if (height > src.height) throw new Error(`crop taller than source (${height} > ${src.height})`);
  top = Math.min(Math.max(0, top), src.height - height);
  if (left + width > src.width) throw new Error("crop wider than source");
  return { left, top, width, height };
}

async function writeSet(buf, rect, dir, base, widths, jpgOnly = false) {
  fs.mkdirSync(dir, { recursive: true });
  const cropped = await sharp(buf).extract(rect).toBuffer();
  const files = [];
  const usable = widths.filter((w) => w <= rect.width);
  if (!usable.length) usable.push(rect.width);
  for (const w of usable) {
    const h = Math.round((w * rect.height) / rect.width);
    const pipe = () => sharp(cropped).resize(w, h); // sharp drops metadata unless withMetadata() is called
    const stem = path.join(dir, `${base}-${w}`);
    await pipe().jpeg({ quality: JPG_Q, mozjpeg: true, progressive: true }).toFile(`${stem}.jpg`);
    files.push(`${stem}.jpg`);
    if (!jpgOnly) {
      await pipe().avif({ quality: AVIF_Q, effort: 5 }).toFile(`${stem}.avif`);
      await pipe().webp({ quality: WEBP_Q }).toFile(`${stem}.webp`);
      files.push(`${stem}.avif`, `${stem}.webp`);
    }
  }
  const aspectH = Math.round((usable[0] * rect.height) / rect.width);
  return { widths: usable, width: usable.at(-1), height: Math.round((usable.at(-1) * rect.height) / rect.width), aspectH, files };
}

function publicPath(abs) {
  return "/" + path.relative(path.join(ROOT, "public"), abs).split(path.sep).join("/");
}

async function processStill(a) {
  const file = path.join(SRC, a.file);
  if (!fs.existsSync(file)) {
    console.warn(`  ! ${a.id}: source missing (${a.file}), skipped`);
    return null;
  }
  const src = await loadRotated(a.file);
  const buf = await applyBlur(src, a.blur);
  const dir = path.join(OUT_IMG, a.project.toLowerCase());
  const rect = cropRect(src, a.crop);
  const main = await writeSet(buf, rect, dir, a.id, WIDTHS);
  const entry = {
    id: a.id, project: a.project, kind: "image", driveId: a.driveId, copyId: a.copyId, alt: a.alt,
    width: main.width, height: main.height,
    base: publicPath(path.join(dir, a.id)), widths: main.widths,
    cropNotes: `${a.crop.aspect.join(":")} crop from ${src.width}x${src.height} at [${rect.left},${rect.top},${rect.width}x${rect.height}]${a.blur ? `; blurred ${a.blur.length} region(s)` : ""}. ${a.notes}`,
    variants: {},
  };
  for (const [name, v] of Object.entries(a.variants ?? {})) {
    const r = cropRect(src, v);
    const set = await writeSet(buf, r, dir, `${a.id}-${name}`, v.widths, v.jpgOnly);
    entry.variants[name] = {
      base: publicPath(path.join(dir, `${a.id}-${name}`)), widths: set.widths, width: set.width, height: set.height, jpgOnly: !!v.jpgOnly,
    };
  }
  console.log(`  ✓ ${a.id} ${entry.width}x${entry.height}`);
  return entry;
}

function ffprobe(file) {
  const out = execFileSync("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", file]);
  return JSON.parse(out.toString());
}

function processVideo(v) {
  const file = path.join(SRC, v.file);
  if (!fs.existsSync(file)) {
    console.warn(`  ! ${v.id}: source missing (${v.file}), skipped`);
    return null;
  }
  if (v.start == null || v.duration == null) {
    console.warn(`  ! ${v.id}: no segment chosen yet, skipped`);
    return null;
  }
  fs.mkdirSync(OUT_VID, { recursive: true });
  const base = path.join(OUT_VID, v.id);
  const dur = Math.min(v.duration, 12);
  const scale = "scale='if(gt(iw,ih),min(1080,iw),-2)':'if(gt(iw,ih),-2,min(1080,ih))'";
  const vf = [scale, v.liftExposure ? "eq=brightness=0.06:gamma=1.15" : null].filter(Boolean).join(",");
  const common = ["-y", "-v", "error", "-ss", String(v.start), "-t", String(dur), "-i", file, "-an", "-map_metadata", "-1", "-vf", vf];

  // Encode, then step bitrate down until the file fits the 3 MB budget.
  for (const kbps of [1800, 1400, 1100, 850, 650]) {
    execFileSync("ffmpeg", [...common, "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-b:v", `${kbps}k`, "-maxrate", `${kbps * 1.3}k`, "-bufsize", `${kbps * 2}k`, "-movflags", "+faststart", `${base}.mp4`]);
    if (fs.statSync(`${base}.mp4`).size <= MAX_VIDEO_BYTES) break;
  }
  for (const kbps of [1500, 1150, 900, 700, 520]) {
    execFileSync("ffmpeg", [...common, "-c:v", "libvpx-vp9", "-b:v", `${kbps}k`, "-deadline", "good", "-cpu-used", "2", "-row-mt", "1", `${base}.webm`]);
    if (fs.statSync(`${base}.webm`).size <= MAX_VIDEO_BYTES) break;
  }
  execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", String(v.start + v.posterAt), "-i", file, "-frames:v", "1", "-map_metadata", "-1", "-vf", vf, "-q:v", "3", `${base}-poster.jpg`]);

  const probe = ffprobe(`${base}.mp4`);
  const vs = probe.streams.find((s) => s.codec_type === "video");
  const audio = probe.streams.some((s) => s.codec_type === "audio");
  const sizes = { mp4: fs.statSync(`${base}.mp4`).size, webm: fs.statSync(`${base}.webm`).size };
  if (audio) throw new Error(`${v.id}: audio stream present`);
  if (sizes.mp4 > MAX_VIDEO_BYTES || sizes.webm > MAX_VIDEO_BYTES) throw new Error(`${v.id}: over 3 MB`);
  console.log(`  ✓ ${v.id} ${vs.width}x${vs.height} ${dur}s mp4=${(sizes.mp4 / 1e6).toFixed(2)}MB webm=${(sizes.webm / 1e6).toFixed(2)}MB`);
  return {
    id: v.id, project: v.project, kind: "video", driveId: v.driveId, copyId: v.copyId, alt: v.alt,
    width: vs.width, height: vs.height, duration: dur,
    mp4: publicPath(`${base}.mp4`), webm: publicPath(`${base}.webm`), poster: publicPath(`${base}-poster.jpg`),
    cropNotes: `${v.role}. Segment ${v.start}s–${v.start + dur}s, muted (audio track removed), ${v.liftExposure ? "exposure lifted, " : ""}long edge ≤ 1080.`,
  };
}

function writeManifest(images, videos) {
  const body = `// GENERATED by scripts/process-media.mjs — do not edit by hand.
// Source originals live in the owner's Drive; see QA-REPORT.md for the review notes.

export type ImageVariant = {
  base: string;
  widths: number[];
  width: number;
  height: number;
  jpgOnly: boolean;
};

export type ImageAsset = {
  id: string;
  project: string;
  kind: "image";
  /** Original file in the owner's Drive (05-ASSET-INVENTORY.csv). */
  driveId: string;
  /** SOURCE-MEDIA copy the export was made from. */
  copyId: string;
  alt: string;
  width: number;
  height: number;
  /** Path stem; files are \`\${base}-\${w}.{avif,webp,jpg}\`. */
  base: string;
  widths: number[];
  cropNotes: string;
  variants: Record<string, ImageVariant>;
};

export type VideoAsset = {
  id: string;
  project: string;
  kind: "video";
  driveId: string;
  copyId: string;
  alt: string;
  width: number;
  height: number;
  duration: number;
  mp4: string;
  webm: string;
  poster: string;
  cropNotes: string;
};

export const imageAssets: Record<string, ImageAsset> = ${JSON.stringify(Object.fromEntries(images.map((i) => [i.id, i])), null, 2)};

export const videoAssets: Record<string, VideoAsset> = ${JSON.stringify(Object.fromEntries(videos.map((v) => [v.id, v])), null, 2)};
`;
  fs.writeFileSync(MANIFEST, body);
}

async function verifyNoMetadata(dirs) {
  const files = dirs.flatMap((d) => (fs.existsSync(d) ? fs.readdirSync(d, { recursive: true }).map((f) => path.join(d, f)) : []))
    .filter((f) => /\.(jpg|webp|avif|mp4|webm)$/i.test(f));
  let bad = 0;
  for (const f of files) {
    const t = await exiftool.read(f);
    const hits = Object.keys(t).filter((k) => /^GPS|^Make$|^Model$|DateTimeOriginal|CreateDate|LensModel|Software|SerialNumber/i.test(k));
    if (hits.length) {
      bad++;
      console.error(`  ✗ metadata in ${path.relative(ROOT, f)}: ${hits.join(", ")}`);
    }
  }
  console.log(`  exiftool: ${files.length} files checked, ${bad} with GPS/EXIF`);
  if (bad) process.exitCode = 1;
}

async function main() {
  if (!fs.existsSync(SRC)) throw new Error("_source-media/ not found — download the SOURCE-MEDIA folder first.");
  console.log("Stills");
  const images = [];
  for (const a of ASSETS.filter(pick)) {
    const e = await processStill(a);
    if (e) images.push(e);
  }
  console.log("Videos");
  const videos = [];
  for (const v of VIDEOS.filter(pick)) {
    const e = processVideo(v);
    if (e) videos.push(e);
  }
  if (!only) writeManifest(images, videos);
  console.log("Metadata check");
  await verifyNoMetadata([OUT_IMG, OUT_VID]);
  await exiftool.end();
}

main().catch(async (e) => {
  console.error(e);
  await exiftool.end();
  process.exit(1);
});
