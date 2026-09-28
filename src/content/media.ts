import { imageAssets, videoAssets, type ImageAsset, type ImageVariant, type VideoAsset } from "./media-manifest";

export type { ImageAsset, ImageVariant, VideoAsset };

/** Returns the processed image, or undefined if its source hasn't been exported yet. */
export function getImage(id: string): ImageAsset | undefined {
  return imageAssets[id];
}

export function getVideo(id: string): VideoAsset | undefined {
  return videoAssets[id];
}

/** Keeps only ids that have exported media, preserving order. */
export function getImages(ids: readonly string[]): ImageAsset[] {
  return ids.map(getImage).filter((a): a is ImageAsset => Boolean(a));
}

export function getVideos(ids: readonly string[]): VideoAsset[] {
  return ids.map(getVideo).filter((a): a is VideoAsset => Boolean(a));
}
