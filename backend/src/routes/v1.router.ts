import Router, {NextFunction, Response} from 'express';
import {Request} from "@core/express";
import attendanceRouter from "./attendance.router";
import cr from "./child.router";
import gr from "./group.router"

const v1 = Router();

v1.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        message: '/v1/ endpoint is available',
        time: new Date().toISOString(),
        status: 'ok',
    });
});

v1.use("/attendance", attendanceRouter);
v1.use("/child", cr);
v1.use("/group", gr);

export default v1;