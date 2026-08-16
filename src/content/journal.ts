export type JournalArticle = {
  slug: string;
  title: string;
  category: "Planning" | "Design" | "Venues";
  excerpt: string;
  readingTime: string;
  body: string[];
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "questions-before-booking-your-venue",
    title: "Five Questions to Ask Before Booking Your Venue",
    category: "Venues",
    excerpt:
      "The details that matter most rarely show up on a venue's website — here's what to ask before you sign.",
    readingTime: "4 min read",
    body: [
      "A beautiful room is only half the decision. Before you commit to a venue, get clarity on load-in and load-out windows — vendors need enough time to set up and break down without rushing the room.",
      "Ask what's included versus rented separately: tables, chairs, linens, and lighting vary widely between venues, and assuming too much can quietly inflate a budget.",
      "Confirm noise ordinances and end times, especially for outdoor spaces. Find out what happens in the event of rain if any part of your celebration is outside.",
      "Ask about preferred or required vendor lists. Some venues restrict outside vendors, which can affect both cost and creative flexibility.",
      "Finally, walk the space at the time of day your event will actually happen. Lighting, temperature, and sound carry very differently in the afternoon than in the evening.",
    ],
  },
  {
    slug: "how-to-build-a-cohesive-color-palette",
    title: "How to Build a Cohesive Color Palette for Your Celebration",
    category: "Design",
    excerpt:
      "A palette that photographs well and feels intentional usually comes down to restraint, not variety.",
    readingTime: "3 min read",
    body: [
      "Most cohesive event palettes are built on a simple ratio: one dominant neutral, one or two supporting tones, and a single accent used sparingly for emphasis.",
      "Start from a single fixed point — a venue's existing materials, a family heirloom, or a favorite fabric — and build outward from there rather than choosing colors in isolation.",
      "Test the palette in the actual lighting conditions of your venue when possible. Warm string lighting and cool overhead lighting can shift how the same colors read.",
      "Resist adding a color to satisfy every element of the room. Restraint is usually what makes a palette read as designed rather than assembled.",
    ],
  },
  {
    slug: "planning-timeline-first-year",
    title: "A Realistic Planning Timeline for Your First Year of Engagement",
    category: "Planning",
    excerpt:
      "A grounded, month-by-month framework for the decisions that actually need to happen early.",
    readingTime: "5 min read",
    body: [
      "The first decisions that matter are the ones with the least flexibility later: date, venue, and guest count range. Everything else can be adjusted around these three.",
      "Book vendors with the least availability first — photographers, popular venues, and highly requested planners are often booked 9–12 months out.",
      "Leave the last two months for confirmation, not decisions: final headcounts, timelines, and vendor logistics rather than new choices.",
      "Build in deliberate pauses. A planning process that never slows down tends to produce decision fatigue rather than clarity.",
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return journalArticles.find((a) => a.slug === slug);
}
