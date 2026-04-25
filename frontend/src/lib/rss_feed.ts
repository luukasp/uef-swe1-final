import Parser from "rss-parser";

export type FeedItem = {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
};

const parser = new Parser();

/**
 * Placeholder data shown when feed parsing fails or returns no useful items.
 * Kept menu-focused for quick dialog rendering in the UI.
 */
const FALLBACK_MENU_ITEMS: FeedItem[] = [
  {
    title: "Breakfast: Oatmeal with banana slices",
    link: "#",
  },
  {
    title: "Lunch: Mac & Cheese with cucumber sticks",
    link: "#",
  },
  {
    title: "Snack: Apple slices and yogurt",
    link: "#",
  },
];

function toSafeFeedItem(item: Parser.Item): FeedItem | null {
  const title = (item.title ?? "").trim();
  const link = (item.link ?? "").trim();

  // Keep only entries that can be rendered meaningfully.
  if (!title) return null;

  return {
    title,
    link: link || "#",
    pubDate: item.pubDate,
    contentSnippet: item.contentSnippet,
  };
}

/**
 * Fetch and parse an RSS feed for menu dialog use.
 * Always returns a render-safe array; never throws.
 */
export async function getFeed(
  url: string,
  fallback: FeedItem[] = FALLBACK_MENU_ITEMS,
): Promise<FeedItem[]> {
  try {
    const safeUrl = (url ?? "").trim();
    if (!safeUrl) return fallback;

    const feed = await parser.parseURL(safeUrl);
    const items = (feed.items ?? [])
      .map(toSafeFeedItem)
      .filter((item): item is FeedItem => item !== null);

    return items.length > 0 ? items : fallback;
  } catch (error) {
    console.error("Failed to parse RSS feed:", error);
    return fallback;
  }
}

/**
 * Optional export if UI wants direct access to defaults.
 */
export const MENU_FALLBACK_FEED_ITEMS = FALLBACK_MENU_ITEMS;
