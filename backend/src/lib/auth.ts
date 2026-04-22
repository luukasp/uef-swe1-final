import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle"
import db from "../database"
import {admin, username, jwt, openAPI} from "better-auth/plugins";
import * as schema from "../models/schema";
import {ac, administrator, superuser, staff, parent, } from "./permissions";

const auth = betterAuth({
    database: drizzleAdapter(db,
        {
            provider: "pg",
            schema: schema
        }
    ),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
            tenantId: 'common',
            authority: 'https://login.microsoftonline.com',
            prompt: 'select_account consent'
        }
    },
    plugins: [
        admin({
            ac,
            roles: {
                parent,
                administrator,
                staff,
                superuser,
            },
            adminRoles: ["administrator", "superuser"]
        }),
        username({
            minUsernameLength: 5,
            maxUsernameLength: 32,
            usernameNormalization: (username) => {
                return username.toLowerCase();
            },
            usernameValidator: (username) => {
                return /^[a-zA-Z0-9_-]+$/.test(username);
            },
            displayUsernameValidator: (displayUsername) => {
                // Allow only alphanumeric characters, underscores, and hyphens
                return /^[a-zA-Z0-9_-]+$/.test(displayUsername)
            },
            validationOrder: {
                username: "post-normalization",
                displayUsername: "post-normalization",
            }
        }),
        jwt(),
        openAPI()
    ],
    trustedOrigins: [
        process.env.FRONTEND_URL!
    ]
});

export default auth;
export {auth}