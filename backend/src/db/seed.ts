import { db } from "./index";

import { auth } from "../lib/auth";
import { count, eq } from "drizzle-orm";
import { user } from "../models/schema";

export async function seed() {
  const [userCount] = await db.select({ value: count() }).from(user);

  if (userCount.value === 0) {
    console.log("No users found. Seeding Super Admin...");

    // Create the user via Better Auth API so password is hashed
    const adminUser = await auth.api.signUpEmail({
      body: {
        email: "admin@daycare.com",
        password: "ChangeMe123!",
        name: "Super Admin",
      },
    });

    if (adminUser) {
      // Set the role to 'admin' (Better Auth default for the admin plugin)
      await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.email, "admin@daycare.com"));

      console.log("✅ Admin seeded: admin@daycare.com / ChangeMe123!");
    }
  }
}
