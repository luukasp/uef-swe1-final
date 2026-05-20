import { db } from "../db";
import { eq } from "drizzle-orm";
import { attendance } from "../models/schema";

import { randomUUID } from "node:crypto";
import { AttendanceType } from "../models/attendence.schema";

export const findAllAttendance = async () => {
  return await db.select().from(attendance);
};

export const findAttendanceByChild = async (childId: string) => {
  return await db
    .select()
    .from(attendance)
    .where(eq(attendance.child_id, childId));
};

export const createAttendance = async (data: AttendanceType) => {
  const [result] = await db
    .insert(attendance)
    .values({
      id: crypto.randomUUID(),
      attendance_date: data.attendance_date,
      check_in_time: data.check_in_time,
      check_out_time: data.check_out_time,
      status: data.status ?? false,
      justification: data.justification,
      child_id: data.child_id!,
    })
    // This part requires the index you just added
    .onConflictDoUpdate({
      target: [attendance.child_id, attendance.attendance_date],
      set: {
        status: data.status,
        check_in_time: data.check_in_time,
        check_out_time: data.check_out_time,
        justification: data.justification,
      },
    })
    .returning();

  return result;
};

export const updateAttendance = async (
  id: string,
  data: Partial<AttendanceType>,
) => {
  const [result] = await db
    .update(attendance)
    .set({
      check_in_time: data.check_in_time,
      check_out_time: data.check_out_time,
      status: data.status,
      justification: data.justification,
    })
    .where(eq(attendance.id, id))
    .returning();

  return result;
};

export const deleteAttendance = async (id: string) => {
  return await db.delete(attendance).where(eq(attendance.id, id));
};
