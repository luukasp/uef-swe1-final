import {Response, NextFunction} from "express";
import {Request} from "@core/express";

export default async function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log("Logger: ")
    console.log("Body: " + JSON.stringify(req.body));
    console.log("Params: " + JSON.stringify(req.params));
    console.log("Headers: " + JSON.stringify(req.headers));
    console.log("Query: " + JSON.stringify(req.query));
    next();
}