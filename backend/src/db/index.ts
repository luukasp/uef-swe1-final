import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as dotenv from "dotenv";

// Add this line at the very top of the file!
dotenv.config();

neonConfig.webSocketConstructor = ws;

// Debug check: This will help you see if it's actually loading
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is undefined. Check your .env file location.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
