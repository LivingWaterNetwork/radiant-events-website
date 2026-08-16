const GRADIENTS = [
  "from-aubergine via-ink-deep to-ink",
  "from-tangerine via-coral to-blush",
  "from-blush via-cream to-taupe",
  "from-ink via-aubergine to-coral",
];

export default function PlaceholderMedia({
  index = 0,
  label,
  className = "",
}: {
  index?: number;
  label?: string;
  className?: string;
}) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
      aria-label={label ?? "Placeholder image — replace with event photography"}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M20 100 Q 60 20, 100 100 T 180 100"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
        <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>
      {label && (
        <span className="absolute bottom-3 left-3 rounded-full bg-ink/50 px-3 py-1 text-[10px] uppercase tracking-wide-lg text-cream-light font-sans">
          {label}
        </span>
      )}
    </div>
  );
}
