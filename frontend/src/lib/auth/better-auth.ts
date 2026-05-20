import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Point this to your Elysia server
  baseURL: "http://localhost:3000",
});
