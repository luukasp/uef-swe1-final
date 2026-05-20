import { Elysia, t } from "elysia";
import {
  createAttendance,
  deleteAttendance,
  findAllAttendance,
  findAttendanceByChild,
  updateAttendance,
} from "../controller/attendence.controller";
import { isAuthenticated } from "../middleware/auth";
import {
  AttendanceSchema,
  AttendanceUpdateSchema,
} from "../models/attendence.schema";

export const attendanceRoutes = new Elysia({ prefix: "/attendance" })
  .use(isAuthenticated)

  // Get all attendance records
  .get("/list", () => findAllAttendance())

  // Get records for a specific child
  .get("/child/:childId", ({ params: { childId } }) =>
    findAttendanceByChild(childId),
  )

  // Create attendance for a child
  .post(
    "/child/:childId",
    async ({ params: { childId }, body, set }) => {
      const result = await createAttendance({ ...body, child_id: childId });
      if (!result) {
        set.status = 400;
        return { error: "Invalid attendance data" };
      }
      return { status: "success", attendance: result };
    },
    {
      body: t.Omit(AttendanceSchema, ["child_id"]),
    },
  )

  // Update a record
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const result = await updateAttendance(id, body);
      return { status: "success", attendance: result };
    },
    {
      body: AttendanceUpdateSchema,
    },
  )

  // Delete a record
  .delete("/:id", async ({ params: { id } }) => {
    await deleteAttendance(id);
    return { status: "success" };
  });
