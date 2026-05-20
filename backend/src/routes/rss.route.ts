import { Elysia, t } from "elysia";
import Parser from "rss-parser";

// Add a User-Agent so servers don't block the request
const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

export const rssRoutes = new Elysia({ prefix: "/rss" }).get(
  "/",
  async ({ query: { url }, set }) => {
    try {
      // 1. Decode the URL
      let cleanedUrl = decodeURIComponent(url);

      // 2. SAFETY NET: If the URL is wrapped in Markdown [text](link), extract just the link
      const markdownMatch = cleanedUrl.match(/\((https?:\/\/[^\)]+)\)/);
      if (markdownMatch) {
        cleanedUrl = markdownMatch[1];
      }

      // 3. Remove any remaining brackets or whitespace
      cleanedUrl = cleanedUrl.replace(/[\[\]]/g, "").trim();

      console.log(`Actually fetching: "${cleanedUrl}"`);

      const feed = await parser.parseURL(cleanedUrl);

      return {
        title: feed.title,
        items: feed.items.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
        })),
      };
    } catch (error) {
      set.status = 400;
      return { error: "Failed to reach the RSS feed", detail: error.message };
    }
  },
  {
    query: t.Object({
      url: t.String(),
    }),
  },
);
