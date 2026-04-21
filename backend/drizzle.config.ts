import dotenv from "dotenv";
dotenv.config();
import {defineConfig} from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "src/models/schema.ts",
    dbCredentials: {
        url: process.env.DB_URL!
    }
});