import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../models/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
    camelCase: false,
  }),
  emailAndPassword: { enabled: true },
  plugins: [admin()],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: ["http://localhost:5000"],
});
