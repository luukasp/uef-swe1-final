import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { Response, NextFunction } from "express";
import { Request } from "@core/express";

function parseCookie(cookieHeader: string | undefined) {
  const map: Record<string, string> = {};
  if (!cookieHeader) return map;
  cookieHeader.split(";").forEach((pair) => {
    const idx =
      pair.indexOf(":") !== -1 ? pair.indexOf(":") : pair.indexOf("=");
    const [k, v] =
      idx === -1
        ? [pair.trim(), ""]
        : [pair.slice(0, idx).trim(), pair.slice(idx + 1).trim()];
    const key = k.replace(/^\s+|\s+$/g, "");
    const value = v.replace(/^\s+|\s+$/g, "");
    if (key) map[key] = decodeURIComponent(value);
  });
  return map;
}

export default async function requireSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Prepare headers for better-auth: include incoming headers
    const headers = fromNodeHeaders(req.headers);

    // If a server-side cookie is set (like ba_session), forward it as Authorization Bearer
    const cookieHeader =
      (req.headers && (req.headers as any).cookie) || undefined;
    const cookies = parseCookie(cookieHeader as string | undefined);
    const cookieName = process.env.AUTH_COOKIE_NAME || "ba_session";
    const token =
      cookies[cookieName] || cookies["ba.session"] || cookies["session"];
    if (token) {
      // headers may be a Headers object; use get/set
      try {
        // @ts-ignore - headers may be a Headers-like object
        const hasAuth =
          typeof headers.get === "function"
            ? headers.get("authorization")
            : (headers as any)["authorization"];
        if (!hasAuth) {
          if (typeof headers.set === "function") {
            // @ts-ignore
            headers.set("authorization", `Bearer ${token}`);
          } else {
            // @ts-ignore
            headers["authorization"] = `Bearer ${token}`;
          }
        }
      } catch (err) {
        // fallback: set property
        try {
          // @ts-ignore
          headers["authorization"] = `Bearer ${token}`;
        } catch (e) {}
      }
    }

    const session = await auth.api.getSession({ headers });

    if (!session) {
      return res.status(401).send({
        error: "Unauthorized",
        status: 401,
      });
    }
    req.session = session;
    next();
  } catch (e: any) {
    if (res.headersSent) return;
    return res.status(500).send({
      error: e.message,
      status: 500,
    });
  }
}
