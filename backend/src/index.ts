import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Response } from "express";
import { Request } from "@core/express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import v1 from "./routes/v1.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import database from "./database";
import { system_metadata, user } from "./models/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import * as fs from "fs";
import * as path from "path";
import swaggerUi from "swagger-ui-express";
import requireSession from "./middlewares/requireSession";
import requirePermissions, {
  Permissions,
} from "./middlewares/requirePermissions";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);
app.use(helmet());

// Server-side sign-in helper: create a session and set a cookie for the browser
app.post("/api/auth/session", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    // Use better-auth server API to sign in
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/",
        rememberMe: true,
      },
    });

    // Debug: log result keys
    try {
      console.log("/api/auth/session result keys:", Object.keys(result || {}));
    } catch (e) {}

    // Try to extract a session token from the response
    const token =
      (result as any)?.session?.token ||
      (result as any)?.session?.id ||
      (result as any)?.token ||
      (result as any)?.data?.token ||
      (result as any)?.user?.token ||
      null;

    console.log("/api/auth/session extracted token:", !!token);

    if (token) {
      // Set a cookie for the client. Use dev-friendly flags.
      res.cookie(process.env.AUTH_COOKIE_NAME || "ba_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

        path: "/",
        // optionally set maxAge from result
      });
    }

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("/api/auth/session error:", err);
    return res
      .status(400)
      .json({ error: "sign-in failed", detail: err?.message });
  }
});

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Load OpenAPI spec if present and serve docs
const openApiPath = path.join(__dirname, "docs", "openapi.json");
let openApi: any = null;
if (fs.existsSync(openApiPath)) {
  try {
    openApi = JSON.parse(fs.readFileSync(openApiPath, "utf-8"));
    // serve raw JSON
    app.get("/docs/openapi.json", (_req, res) => {
      res.type("application/json").send(openApi);
    });
    // serve Swagger UI
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApi));
    console.log("Swagger UI available at /docs");
  } catch (err) {
    console.warn("Failed to parse OpenAPI spec:", err);
  }
} else {
  console.warn("OpenAPI spec not found at", openApiPath);
}

app.use("/api/v1", v1);

app.use(express.json());

const requireAllTasks: Permissions = {
  allResources: ["allTasks"],
} as Permissions;

app.get(
  "/protected",
  requireSession,
  requirePermissions(requireAllTasks),
  async (req: Request, res: Response) => {
    res.status(200).send({
      message: "User possesses required permissions",
      time: new Date().toISOString(),
      status: 200,
    });
  },
);

app.all("/{*splat}", async (req: Request, res: Response) => {
  if (res.headersSent) return;
  res.status(404).send({
    message:
      "The route or resource you were looking for does not exist or could not be found",
    time: new Date().toISOString(),
    status: "not_found",
  });
});

//#region First Run setup

async function firstRun() {
  const sys__key_installed = await database
    .select()
    .from(system_metadata)
    .where(eq(system_metadata.key, "installed"))
    .limit(1);

  console.log(sys__key_installed);

  if (sys__key_installed.length < 1) {
    console.log(`System ${sys__key_installed} is not installed`);
    console.error("Performing first run setup...");
    const passwd = await randomBytes(16).toString("hex");
    const _user = await auth.api.signUpEmail({
      body: {
        email: "admin@api.localhost",
        password: passwd,
        name: "LOCAL SERVICE/Administrator",
      },
    });
    await database.insert(system_metadata).values({
      key: "installed",
      value: "true",
    });
    await database
      .update(user)
      .set({ role: "superuser" })
      .where(eq(user.id, _user.user.id));
    await database.insert(system_metadata).values({
      key: "admin",
      value: _user.user.id,
    });
    fs.writeFile(".passwd", passwd, function (err) {
      if (err) {
        console.error(err);
        console.error(
          "[ERROR] Superuser password could not be saved on disk. It will be displayed now.",
        );
        console.error("[ERROR] Superuser password: " + passwd);
        return console.error("[ERROR] Save this password securely");
      }
      console.log(
        "[ALERT]: The superuser account has been created! Password has been written into .passwd",
      );
    });
  }
  if (sys__key_installed.length == 1) {
    console.log(`System ${sys__key_installed} is installed`);
    console.log(`Skip first run setup...`);
  }
}

firstRun();

//#endregion

app.listen(process.env.PORT || 3000, () => {
  console.error(`Service running on port: ` + process.env.PORT || 3000);
});
