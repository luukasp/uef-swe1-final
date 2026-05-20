import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { auth } from "./lib/auth"; // Path to your auth file
import { seed } from "./db/seed";
import cors from "@elysia/cors";
import { profileRoutes } from "./routes/profile.route";
import { childRoutes } from "./routes/child.route";
import { groupRoutes } from "./routes/group.route";
import { attendanceRoutes } from "./routes/attendence.route";
import { rssRoutes } from "./routes/rss.route";

const app = new Elysia({ adapter: node() })
  .use(
    cors({
      origin: "http://localhost:5000",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .all("/api/auth/*", ({ request }) => auth.handler(request))

  // 1. First, define the session context
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return { session };
  })

  // 2. Then, mount your routes so they can use the session
  .group("/api", (app) =>
    app
      .use(profileRoutes)
      .use(childRoutes)
      .use(groupRoutes)
      .use(attendanceRoutes)
      .use(rssRoutes)
      .get("/me", ({ session, set }) => {
        if (!session) {
          set.status = 401;
          return { message: "Unauthorized" };
        }
        return session.user;
      }),
  )
  .listen(3000);
seed().catch(console.error);
console.log(`🦊 Elysia is running at http://localhost:3000`);
// Run seed on startup
