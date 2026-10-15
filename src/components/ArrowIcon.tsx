export default function ArrowIcon({
  direction = "up",
}: {
  direction?: "up" | "left" | "right" | "down";
}) {
  return (
    <svg
      className={`arrow-icon arrow-${direction}`}
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
