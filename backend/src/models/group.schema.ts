import { t, Static } from "elysia";

export const GroupSchema = t.Object({
  teacherId: t.String({
    description: "UUID of the staff member",
    minLength: 36, // UUID length
  }),
  childIds: t.Array(t.String(), {
    description: "List of child UUIDs to add to the group",
    default: [],
  }),
});

export type GroupType = Static<typeof GroupSchema>;

// Schema for individual group objects in responses
export const GroupResponseSchema = t.Object({
  id: t.String(),
  teacher_id: t.String(),
  createdAt: t.Optional(t.Any()),
  children: t.Optional(
    t.Array(
      t.Object({
        id: t.String(),
        firstName: t.String(),
        lastName: t.String(),
      }),
    ),
  ),
});
