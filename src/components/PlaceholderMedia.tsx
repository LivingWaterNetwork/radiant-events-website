import Image from "next/image";
const media = [
  {
    src: "/images/pink-arch.webp",
    alt: "Pink balloon installation around a gold circular frame",
  },
  {
    src: "/images/colorful-backdrop.webp",
    alt: "Turquoise and lime balloons framing a purple sequin backdrop",
  },
  {
    src: "/images/game-night.webp",
    alt: "Game-inspired focal moment with balloons and oversized dice",
  },
];
export default function EventMedia({
  index = 0,
  className = "",
}: {
  index?: number;
  className?: string;
  label?: string;
}) {
  const item = media[index % media.length];
  return (
    <div className={"relative overflow-hidden " + className}>
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width:768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}
