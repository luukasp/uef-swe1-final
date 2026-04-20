import {betterAuth, BetterAuthOptions} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle"
import db from "../database"
import {admin, AdminOptions, username, UsernameOptions, jwt, openAPI} from "better-auth/plugins";
import * as schema from "../models/schema";
import {ac, adminRole, defaultRole} from "./permissions";

const adminOpts: AdminOptions = {
    ac,
    roles: {
        defaultRole,
        adminRole,
    }
} as AdminOptions;

const usernameOpts: UsernameOptions = {
    minUsernameLength: 5,
    maxUsernameLength: 32,
    usernameNormalization: (username) => {
        return username.toLowerCase();
    },
    usernameValidator: (username) => {
        return !(username === "admin" || username === "root") && /^[a-zA-Z0-9_-]+$/.test(username);
    },
    displayUsernameValidator: (displayUsername) => {
        // Allow only alphanumeric characters, underscores, and hyphens
        return /^[a-zA-Z0-9_-]+$/.test(displayUsername)
    },
    validationOrder: {
        username: "post-normalization",
        displayUsername: "post-normalization",
    }
} as UsernameOptions;

const betterAuthOpts: BetterAuthOptions = {
    database: drizzleAdapter(db,
        {
            provider: "mysql",
            schema: schema
        }
    ),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        admin(adminOpts),
        username(usernameOpts),
        jwt(),
        openAPI()
    ]
} as BetterAuthOptions;

export const auth = betterAuth(betterAuthOpts);