import Link from "next/link";
import { site } from "@/content/site";

export default function Wordmark({ onClick, tone = "dark" }: { onClick?: () => void; tone?: "dark" | "light" }) {
  return (
    <Link href="/" onClick={onClick} className="inline-flex min-h-11 flex-col justify-center" aria-label={`${site.name}, home`}>
      <span className={`font-display text-xl font-medium leading-tight md:text-2xl ${tone === "dark" ? "text-olive-deep" : "text-ivory"}`}>
        {site.name}
      </span>
      <span className={`mt-0.5 text-[0.625rem] font-medium uppercase tracking-[0.22em] ${tone === "dark" ? "text-olive-deep" : "text-ivory"}`}>
        {site.descriptor}
      </span>
    </Link>
  );
}
