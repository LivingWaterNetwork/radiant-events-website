import { focalPoints } from "@/content/focal-points";
import type { ImageAsset, ImageVariant } from "@/content/media";

// Renders the pipeline's pre-built AVIF/WebP/JPG sets (scripts/process-media.mjs).
// The files are already resized and metadata-free, so they bypass runtime
// optimization and are served straight from /public with explicit dimensions.

type Source = { base: string; widths: number[]; jpgOnly?: boolean };

// Phones get the 800w files (~2x density on a 390px screen). This keeps every
// image delivered at mobile width well under 400 KB, even as a JPG fallback.
const MOBILE_SIZES = "(max-width: 767px) 260px";

const srcSet = (s: Source, ext: string) => s.widths.map((w) => `${s.base}-${w}.${ext} ${w}w`).join(", ");

export default function Picture({
  image,
  sizes,
  className = "",
  imgClassName = "",
  priority = false,
  alt,
  mobile,
  desktop,
  mobileQuery = "(max-width: 767px)",
}: {
  image: ImageAsset;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Override alt, e.g. "" for decorative duplicates. */
  alt?: string;
  /** Art-directed variants (hero). */
  mobile?: ImageVariant;
  desktop?: ImageVariant;
  mobileQuery?: string;
}) {
  const main: Source = desktop ?? image;
  const dims = desktop ?? image;
  const fallbackWidth = main.widths.includes(1600) ? 1600 : main.widths.at(-1)!;
  const allSizes = `${MOBILE_SIZES}, ${sizes}`;
  return (
    <picture className={className}>
      {mobile && (
        <>
          <source media={mobileQuery} type="image/avif" srcSet={srcSet(mobile, "avif")} sizes={allSizes} width={mobile.width} height={mobile.height} />
          <source media={mobileQuery} type="image/webp" srcSet={srcSet(mobile, "webp")} sizes={allSizes} width={mobile.width} height={mobile.height} />
          <source media={mobileQuery} srcSet={srcSet(mobile, "jpg")} sizes={allSizes} width={mobile.width} height={mobile.height} />
        </>
      )}
      <source type="image/avif" srcSet={srcSet(main, "avif")} sizes={allSizes} />
      <source type="image/webp" srcSet={srcSet(main, "webp")} sizes={allSizes} />
      <img
        src={`${main.base}-${fallbackWidth}.jpg`}
        srcSet={srcSet(main, "jpg")}
        sizes={allSizes}
        width={dims.width}
        height={dims.height}
        alt={alt ?? image.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={imgClassName}
        style={focalPoints[image.id] ? { objectPosition: focalPoints[image.id] } : undefined}
      />
    </picture>
  );
}
