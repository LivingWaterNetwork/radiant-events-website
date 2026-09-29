// Where to anchor an image when a layout crops it (CSS object-position).
// Kept apart from the media manifest so client components stay small.
export const focalPoints: Record<string, string> = {
  // 4:3 flower wall in 4:5 frames: keep the backdrop's lettering and left rose border whole.
  "E04-02": "18% 50%",
};
