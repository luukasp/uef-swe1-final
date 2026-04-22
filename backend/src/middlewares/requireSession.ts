import {fromNodeHeaders} from "better-auth/node";
import {auth} from "../lib/auth";
import {Response, NextFunction} from "express";
import {Request} from "@core/express";

export default async function requireSession(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if (!session) {

            return res.status(401).send({
                error: "Unauthorized",
                status: 401,
            });
        }
        req.session = session;
        next();
    }
    catch (e: any) {
        if (res.headersSent) return;
        return res.status(500).send({
            error: e.message,
            status: 500,
        });
    }
}