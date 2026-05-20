import { t, Static } from "elysia";

export const AttendanceSchema = t.Object({
  attendance_date: t.String(), // ISO date string
  check_in_time: t.Number(),
  check_out_time: t.Number(),
  status: t.Optional(t.Boolean({ default: false })),
  justification: t.Optional(t.Nullable(t.String())),
  child_id: t.Optional(t.String()),
});

export const AttendanceUpdateSchema = t.Partial(
  t.Omit(AttendanceSchema, ["attendance_date", "child_id"]),
);

export type AttendanceType = Static<typeof AttendanceSchema>;
