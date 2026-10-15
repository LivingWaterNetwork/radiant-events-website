import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { absoluteUrl } from "@/lib/seo";
export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map((item, i) => (
            <li key={item.href}>
              {i === trail.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </>
  );
}
