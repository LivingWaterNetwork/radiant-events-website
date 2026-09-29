// Helpful Reads (formerly Journal). Source: 03 Helpful Reads — the three existing
// articles, kept and edited for accuracy (décor questions added to article 1,
// approved images on article 2, no out-of-scope promises on article 3).

export type ArticleBlock = { heading?: string; text: string };

export type Article = {
  slug: string;
  title: string;
  category: "Venues" | "Design" | "Planning";
  excerpt: string;
  readingTime: string;
  imageIds: string[];
  body: ArticleBlock[];
};

export const helpfulReadsCopy = {
  title: "Helpful Reads",
  intro: "Practical ideas for planning a celebration that looks beautiful and feels like you.",
  closing: { text: "Planning something?", cta: "Start Your Event Inquiry" },
  related: "Keep reading",
  back: "All Helpful Reads",
  readArticle: "Read article",
};

export const articles: Article[] = [
  {
    slug: "questions-before-booking-your-venue",
    title: "Five Questions to Ask Before Booking Your Venue",
    category: "Venues",
    excerpt:
      "The details that matter most rarely show up on a venue's website. Here's what to ask before you sign.",
    readingTime: "4 min read",
    imageIds: [],
    body: [
      {
        text: "A beautiful room is only half the decision. Before you commit, ask the questions that decide how smoothly the day, and the décor, will come together.",
      },
      {
        heading: "1. When can setup begin, and when does everything need to be out?",
        text: "Ask for the exact load-in time and the setup access window, plus the load-out deadline. Installations like balloon arches and backdrops are built on site, and a short window can limit what's possible or add a rush to the day.",
      },
      {
        heading: "2. What's included, and what's rented separately?",
        text: "Tables, chairs, linens, and lighting vary widely between venues. Knowing what's already there keeps the budget honest and shows where décor can do the most work.",
      },
      {
        heading: "3. What are the décor rules?",
        text: "Ask about ceiling height if you're dreaming of anything tall, and whether balloons are allowed and where. Check the open-flame policy before you plan a candlelit table, and ask how décor can be attached to walls, railings, or doors.",
      },
      {
        heading: "4. Are there preferred or required vendors?",
        text: "Some venues limit outside vendors, which can affect both cost and creative flexibility. Ask early, before you fall in love with a plan.",
      },
      {
        heading: "5. How does the space feel at the time of your event?",
        text: "Walk the room at the hour your celebration will happen. Light, temperature, and sound change through the day, and for outdoor spaces, ask what happens if it rains.",
      },
    ],
  },
  {
    slug: "how-to-build-a-cohesive-color-palette",
    title: "How to Build a Cohesive Color Palette for Your Celebration",
    category: "Design",
    excerpt:
      "A palette that photographs well and feels intentional usually comes down to restraint, not variety.",
    readingTime: "3 min read",
    imageIds: ["E01-03", "E03-02"],
    body: [
      {
        text: "Most cohesive event palettes are built on a simple ratio: one dominant color family, one or two supporting tones, and a single accent used sparingly for emphasis.",
      },
      {
        heading: "Layer one color family",
        text: "For a Sweet 16 garden celebration, we stayed inside one family of pinks, from soft blush to deep fuchsia, and let the ribbon fringe and white marquee numbers give the eye a place to rest.",
      },
      {
        heading: "Or pair two confident brights",
        text: "For a ministry welcome wall, teal and lime garlands framed a purple shimmer wall. Two bright tones against one rich backdrop read as playful and designed rather than busy.",
      },
      {
        heading: "Start from a fixed point",
        text: "Build outward from something that won't change: the venue's materials, a favorite fabric, or the invitation. Then test the palette in the venue's real lighting when you can, because warm and cool light shift how the same colors read.",
      },
      {
        heading: "Choose restraint",
        text: "Resist adding a color for every element in the room. Restraint is usually what makes a palette feel designed rather than assembled.",
      },
    ],
  },
  {
    slug: "planning-timeline-first-year",
    title: "A Realistic Planning Timeline for Your First Year of Engagement",
    category: "Planning",
    excerpt: "A grounded framework for the decisions that actually need to happen early.",
    readingTime: "4 min read",
    imageIds: [],
    body: [
      {
        heading: "Decide the fixed points first",
        text: "The decisions that matter most early are the ones with the least flexibility later: date, venue, and a guest-count range. Everything else can be shaped around these three.",
      },
      {
        heading: "Book the hardest-to-find vendors next",
        text: "Popular venues, photographers, and planners can fill their calendars well ahead, so reach out to the ones you love as soon as your date and venue are settled.",
      },
      {
        heading: "Shape the look in the middle months",
        text: "With the essentials in place, turn to the design: palette, décor, florals, and the moments guests will remember, from the entry to the table.",
      },
      {
        heading: "Save the last two months for confirming",
        text: "Use them for final headcounts, timelines, and vendor logistics rather than new decisions.",
      },
      {
        heading: "Build in pauses",
        text: "A planning process that never slows down tends to produce decision fatigue rather than clarity. Give yourself room to enjoy being engaged.",
      },
    ],
  },
];

export function getArticles() {
  return articles;
}

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 2) {
  return articles.filter((a) => a.slug !== slug).slice(0, count);
}
