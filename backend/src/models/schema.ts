import { relations } from "drizzle-orm";
import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    boolean,
    index,
    date, longtext, primaryKey
} from "drizzle-orm/mysql-core";

// We don't need a separate parent table, even though Nikolaos
// added it, as we can just use the user's id and check roles
// Parent role is part of access control config in permisions.ts
export const user = mysqlTable("user", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    role: text("role"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { fsp: 3 }),
    username: varchar("username", { length: 255 }).unique(),
    displayUsername: text("display_username"),
});

export const session = mysqlTable(
    "session",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
        token: varchar("token", { length: 255 }).notNull().unique(),
        createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { fsp: 3 })
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        impersonatedBy: text("impersonated_by"),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = mysqlTable(
    "account",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: varchar("user_id", { length: 36 })
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { fsp: 3 })
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = mysqlTable(
    "verification",
    {
        id: varchar("id", { length: 36 }).primaryKey(),
        identifier: varchar("identifier", { length: 255 }).notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
        createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { fsp: 3 })
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const jwks = mysqlTable("jwks", {
    id: varchar("id", { length: 36 }).primaryKey(),
    publicKey: text("public_key").notNull(),
    privateKey: text("private_key").notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).notNull(),
    expiresAt: timestamp("expires_at", { fsp: 3 }),
});

// Child is not an user that can log on, nor a role
// A child is simply a data object in the database
export const child = mysqlTable("child", {
   id: varchar("id", { length: 36 }).primaryKey(),
   first_name: varchar("name", { length: 255 }).notNull(),
   last_name: varchar("last_name", { length: 255 }).notNull(),
    date_of_birth: date().notNull(),
    gender: varchar("gender", {length: 45}).notNull(),
    medical_info: longtext("medical_info"),
    },
    (table) => [index("child_name_idx").on(table.first_name), index("child_surname_idx").on(table.last_name)]
);

export const attendance = mysqlTable("attendance", {
  id: varchar("id", { length: 36 }).primaryKey(),
    check_in_time: timestamp("check_in_time", {fsp: 3}).notNull(),
    check_out_time: timestamp("check_out_time", {fsp: 3}).notNull(),
    status: boolean("status").notNull().default(false),
    justification: longtext("justification"),
    child_id: varchar("child_id", { length: 36 }).references(() => child.id),
});

export const parentToChild = mysqlTable("parentToChild", {
    parent_id: varchar("parent_id", { length: 36 }).references(() => user.id),
    child_id: varchar("child_id", { length: 36 }).references(() => child.id),
}, (t) => [primaryKey({columns: [t.parent_id, t.child_id]})]
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const parentChildRelations = relations(parentToChild, ({ one }) => ({
    parent: one(user, {
        fields: [parentToChild.parent_id],
        references: [user.id],
    }),
    child: one(child, {
        fields: [parentToChild.child_id],
        references: [child.id],
    })
}));