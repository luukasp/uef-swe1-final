import Router, {Response} from 'express';
import {Request} from "@core/express";
import AttendanceController, {Attendance} from "../controllers/attendance.controller";
import requireSession from "../middlewares/requireSession";

const attendanceRouter = Router();

attendanceRouter.get("/", requireSession, (req: Request, res: Response) => {
    res.status(200).json({
        message: "This route has no functionality",
        status: 200,
    })
});

attendanceRouter.post("/list", requireSession, async (req: Request, res: Response) => {
    const allAttendances = await AttendanceController.findAll();
    if (!allAttendances) {
        res.status(500).json({
            error: "Internal Server Error",
            status: 500,
        })
    }
    res.status(200).json(allAttendances);
});

attendanceRouter.post("/child/:child_id", requireSession, async (req: Request, res: Response) => {
    const body = req.body;
    const childId = req.params.child_id as string;
    const newAttn: Attendance = {
        attendance_date: body.attendance_date,
        check_in_time: body.check_in_time,
        check_out_time: body.check_out_time,
        status: body.status,
        justification: body.justification ? body.justification : null,
        child_id: childId,
    } as Attendance;
    const r = await AttendanceController.create(newAttn);
    if (r == false) {
        res.status(400).json({
            error: "Bad request",
            status: 400,
            timestamp: new Date().toISOString()
        });
    }
    else {
        res.status(200).json({
            status: "success",
            attendance: r
        });
    }
});

attendanceRouter.get("/child/:child_id/list", requireSession, async (req: Request, res: Response) => {
    const child_id = req.params.child_id as string;
    const attn = await AttendanceController.findAllByChild(child_id);
    if (!attn) {
        res.status(500).json({
            error: "Internal Server Error",
            status: 500,
        });
    }
    res.status(200).json(attn);
});

attendanceRouter.patch('/:id', requireSession, async (req: Request, res: Response) => {
    const body = req.body;
    const attnId = req.params.id as string;
    const newAttn: Attendance = {
        check_in_time: body.check_in_time,
        check_out_time: body.check_out_time,
        status: body.status,
        justification: body.justification ? body.justification : null,
        child_id: body.childId,
    } as Attendance;
    const r = await AttendanceController.update(attnId, newAttn);
    res.status(200).json({
        status: "success",
        attendance: r
    })
});

attendanceRouter.delete("/:id", requireSession, async (req: Request, res: Response) => {
   const attnId = req.params.id as string;
   const r = await AttendanceController.delete(attnId);
   res.status(200).json({
       status: "success",
       attendance: r
   });
});

export default attendanceRouter;