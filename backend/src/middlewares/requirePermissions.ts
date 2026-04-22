import {Request} from "@core/express";
import {Response, NextFunction} from "express";
import auth from "../lib/auth"

export interface Permissions {
    [key: string]: string[];
}

export default function requirePermissions(permissions: Permissions, mode?: "AND" | "OR") {
    return async function (req: Request, res: Response, next: NextFunction) {

        const hasPermissionsAnd = async() => {
            return await auth.api.userHasPermission({
                body: {
                    userId: req.session.user.userId,
                    role: req.session.user.role,
                    permissions: permissions,
                }
            });
        }

        // Holy fuck. Just. Holy fuck.
        const hasPermissionsOr = async() => {
            const permissionChecks = Object.keys(permissions).map(async (resource) => {
                const perms = permissions[resource];
                for (const perm of perms) {
                    const hasPerm = await auth.api.userHasPermission({
                        body: {
                            userId: req.session.user.userId,
                            role: req.session.user.role,
                            permissions: {
                                [resource]: [perm],
                            },
                        }
                    });
                    if (hasPerm.success) {
                        return true;
                    }
                }
                return false;
            });

            const results = await Promise.all(permissionChecks);
            return results.some(result => result);
        }

        if (!req.session) {
            if (res.headersSent) return;
            return res.status(401).send({
                error: "Unauthorized",
                status: 401,
            });
        }
        console.log(req.session.user);
        if (req.session.user.role === "superuser") {
            next();
        }

        let hasPermission;
        if (mode === "AND" || !mode) {
            hasPermission = await hasPermissionsAnd();
        }
        if (mode === "OR") {
            let _ = await hasPermissionsOr();
            hasPermission = {error: null, success: _}
        }

        if (!hasPermission) {
            console.log("Has Permission? " + hasPermission);
            if (res.headersSent) return;
            return res.status(500).send({
                error: "Internal server error",
                status: 500,
            })
        }
        console.log(hasPermission);
        if (hasPermission.error) {
            console.log(hasPermission.error);
            if (res.headersSent) return;
            return res.status(500).send({
                error: "Internal Server Error",
                status: 500,
            })
        }
        if (!hasPermission.success) {
            if (res.headersSent) return;
            return res.status(401).send({
                error: "Unauthorized",
                status: 401,
            })
        }
        next();
    }
}