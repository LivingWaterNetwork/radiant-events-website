import type { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";
import { Container, InquiryBand, PageIntro } from "@/components/sections";
import { homeCopy } from "@/content/home";
import { getPortfolioFilters, getPublishedProjects, portfolioCopy } from "@/content/portfolio";
import { seo, site } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(seo.portfolio);

export default function PortfolioPage() {
  const projects = getPublishedProjects();
  return (
    <>
      <PageIntro eyebrow={site.nav[1].label} title={portfolioCopy.intro.title} body={portfolioCopy.intro.body} />
      <Container className="pb-20 md:pb-28">
        <PortfolioGrid
          projects={projects}
          filters={getPortfolioFilters()}
          allLabel={portfolioCopy.allFilter}
          filterLabel={portfolioCopy.filterLabel}
        />
      </Container>
      <InquiryBand title={homeCopy.inquiryBand.title} />
    </>
  );
}
