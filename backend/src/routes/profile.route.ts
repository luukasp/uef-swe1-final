import { Elysia } from "elysia";
import { auth } from "../lib/auth";
import { db } from "../db";
import { child, parentToChild } from "../models/schema";
import { eq } from "drizzle-orm";

export const profileRoutes = new Elysia({ prefix: "/profile" })
  // This helper middleware ensures every route in this file is protected
  .derive(async ({ request, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      set.status = 401;
      return { session: null };
    }

    return { session };
  })
  .onBeforeHandle(({ session, set }) => {
    if (!session) return { error: "Unauthorized" };
  })

  .get("/me", ({ session }) => {
    return {
      user: session?.user,
    };
  })

  // GET /profile/kids
  .get("/kids", async ({ session }) => {
    // query your old schema using the session ID
    const kids = await db
      .select()
      .from(child)
      .innerJoin(parentToChild, eq(child.id, parentToChild.child_id))
      .where(eq(parentToChild.parent_id, session!.user.id));

    return kids;
  });
