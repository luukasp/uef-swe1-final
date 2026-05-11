export type FeedItem = {
  title: string;
  link: string;
  pubDate?: string;
  contentSnippet?: string;
};

/**
 * Fallback items used when parsing fails or returns empty results.
 */
const FALLBACK_MENU_ITEMS: Array<FeedItem> = [
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

function parseXmlFeed(xmlText: string): FeedItem[] {
  try {
    // DOMParser is available in browsers; this file is intended for client-side use.
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");

    // If the feed produced a parsererror element, bail out.
    if (doc.querySelector("parsererror")) return [];

    const rssItems = Array.from(doc.querySelectorAll("item")).map((node) => {
      const title = node.querySelector("title")?.textContent?.trim() ?? "";
      const link =
        node.querySelector("link")?.textContent?.trim() ||
        node.querySelector("guid")?.textContent?.trim() ||
        "#";
      const pubDate = node.querySelector("pubDate")?.textContent ?? undefined;
      const descriptionNode = node.querySelector("description");
      const contentEncodedNode = node.querySelector("content\:encoded");

      // Prefer innerHTML so UI can render the original formatting (it's trusted source).
      const contentSnippet =
        (descriptionNode && descriptionNode.innerHTML) ||
        (contentEncodedNode && contentEncodedNode.innerHTML) ||
        undefined;

      return { title, link, pubDate, contentSnippet } as FeedItem;
    });

    const atomItems = Array.from(doc.querySelectorAll("entry")).map((node) => {
      const title = node.querySelector("title")?.textContent?.trim() ?? "";
      const link =
        node.querySelector("link")?.getAttribute("href")?.trim() || "#";
      const pubDate =
        node.querySelector("updated")?.textContent ??
        node.querySelector("published")?.textContent ??
        undefined;

      const summaryNode = node.querySelector("summary");
      const contentNode = node.querySelector("content");
      const contentSnippet =
        (summaryNode && summaryNode.innerHTML) ||
        (contentNode && contentNode.innerHTML) ||
        undefined;

      return { title, link, pubDate, contentSnippet } as FeedItem;
    });

    // Keep only items with a title
    return [...rssItems, ...atomItems].filter((i) => i.title.length > 0);
  } catch (e) {
    console.error("Failed to parse XML feed in browser parser:", e);
    return [];
  }
}

/**
 * Fetch and parse an RSS/Atom feed using the browser's fetch + DOMParser.
 * This function never throws; it returns either parsed items or the provided fallback.
 */
export async function getFeed(
  url: string,
  fallback: FeedItem[] = FALLBACK_MENU_ITEMS,
): Promise<FeedItem[]> {
  try {
    const safeUrl = (url ?? "").trim();
    if (!safeUrl) return fallback;

    const res = await fetch(safeUrl);
    if (!res.ok) return fallback;

    const text = await res.text();

    // Prefer DOMParser parsing (works in the browser). If DOMParser isn't available,
    // fall back to the provided defaults.
    if (typeof DOMParser !== "undefined") {
      const items = parseXmlFeed(text);
      return items.length > 0 ? items : fallback;
    }

    return fallback;
  } catch (error) {
    console.error("Failed to fetch/parse RSS feed:", error);
    return fallback;
  }
}

export const MENU_FALLBACK_FEED_ITEMS = FALLBACK_MENU_ITEMS;
