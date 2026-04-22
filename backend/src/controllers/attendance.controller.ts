import database from "../database";
import {attendance, child} from "../models/schema";
import {eq} from "drizzle-orm";
import {randomUUID} from "node:crypto";

export interface Attendance {
    id?: string;
    attendance_date: string;
    check_in_time?: number;
    check_out_time?: number;
    status?: boolean;
    justification?: string;
    child_id?: string;
}

export default class AttendanceController {
    static findAll = async () => {
        let _ = database.select().from(attendance);
        return await _;
    }
    static findOne = async (id: string) => {
        if (id.length != 36) {
            return false;
        }
        let _ = database.select().from(attendance).where(eq(attendance.id, id));
        return await _;
    }
    static findAllByChild = async (child_id: string) => {
        if (child_id.length != 36) {
            return false;
        }
        let _ = database.select().from(attendance).where(eq(attendance.child_id, child_id));
        return await _;
    }
    static update = async (id: string, data: Attendance) => {
        if (data.child_id) {
            return "NOT_ALLOWED_TO_CHANGE_CHILD_ID";
        }
        return await database.update(attendance).set({check_in_time: data.check_in_time, check_out_time: data.check_out_time, status: data.status, justification: data.justification})
            .where(eq(attendance.id, id)).returning();
    }
    static create = async (data: Attendance) => {
        data.id = randomUUID();
        if (data.check_in_time == data.check_out_time || data.check_in_time == null || data.check_out_time == null || data.attendance_date == null || data.child_id == null) {
            return false;
        }
        let a = database.insert(attendance).values({
            id: data.id,
            attendance_date: data.attendance_date,
            check_in_time: data.check_in_time,
            check_out_time: data.check_out_time,
            status: data.status,
            justification: data.justification,
            child_id: data.child_id
        }).returning();
        return a;
    }
    static delete = async (id: string) => {
        return await database.delete(attendance).where(eq(attendance.id, id));
    }
}