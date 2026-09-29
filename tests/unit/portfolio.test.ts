import { describe, expect, it } from "vitest";
import {
  filterSlug,
  getFeaturedProjects,
  getPortfolioFilters,
  getProjectBySlug,
  getPublishedProjects,
  projects,
  type Project,
} from "@/content/portfolio";

const base = projects.find((p) => p.id === "E01")!;
const make = (over: Partial<Project>): Project => ({ ...base, ...over });

describe("portfolio getters", () => {
  it("returns only published projects, in rank order", () => {
    const src = [make({ id: "B", slug: "b", rank: 2 }), make({ id: "A", slug: "a", rank: 1 }), make({ id: "H", slug: "h", rank: 0, published: false })];
    expect(getPublishedProjects(src).map((p) => p.id)).toEqual(["A", "B"]);
  });

  it("drops projects that have no exported media", () => {
    const src = [make({ id: "X", slug: "x", heroAsset: "NOPE", galleryAssets: ["NOPE-2"], heroFromVideo: undefined })];
    expect(getPublishedProjects(src)).toHaveLength(0);
  });

  it("falls back to the first gallery image when the hero is missing", () => {
    const src = [make({ id: "Y", slug: "y", heroAsset: "NOPE", galleryAssets: ["E01-03"] })];
    const [p] = getPublishedProjects(src);
    expect(p.hero.kind === "image" && p.hero.image.id).toBe("E01-03");
  });

  it("derives filters from published projects only, in canonical order", () => {
    const src = [
      make({ id: "M", slug: "m", eventType: "Ministry & Conferences", rank: 1 }),
      make({ id: "B", slug: "b", eventType: "Birthdays & Milestones", rank: 2 }),
      make({ id: "D", slug: "d", eventType: "Dinners & Tablescapes", rank: 3, published: false }),
    ];
    expect(getPortfolioFilters(src)).toEqual(["All", "Birthdays & Milestones", "Ministry & Conferences"]);
  });

  it("adds the Weddings tab automatically once a wedding project is published", () => {
    expect(getPortfolioFilters()).not.toContain("Weddings");
    const withWedding = [...projects, make({ id: "W", slug: "w", eventType: "Weddings", rank: 9 })];
    expect(getPortfolioFilters(withWedding)).toContain("Weddings");
  });

  it("lists featured projects in featured_on_home order (E01, E03, E02)", () => {
    expect(getFeaturedProjects().map((p) => p.id)).toEqual(["E01", "E03", "E02"]);
  });

  it("never publishes E01-02 (identifiable person in frame)", () => {
    expect(getProjectBySlug("pink-sweet-16-garden-celebration")!.gallery.map((g) => g.id)).not.toContain("E01-02");
  });

  it("uses the first sentence of the design story as the summary", () => {
    expect(getProjectBySlug("pink-sweet-16-garden-celebration")!.summary).toBe("Sixteen deserved a moment.");
  });

  it("slugifies filter labels", () => {
    expect(filterSlug("Birthdays & Milestones")).toBe("birthdays-and-milestones");
  });
});
