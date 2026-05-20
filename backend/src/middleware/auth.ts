import { Elysia } from "elysia";
import { auth } from "../lib/auth";

export const isAuthenticated = new Elysia()
  .derive({ as: "global" }, async ({ request, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      set.status = 401;
      return { session: null };
    }

    return { session };
  })
  .onBeforeHandle({ as: "global" }, ({ session, set }) => {
    if (!session) return { error: "Unauthorized" };
  });
