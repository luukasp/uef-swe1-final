import { db } from "../db";
import { attendance, child, parentToChild } from "../models/schema";
import { eq, sql, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { t, type Static } from "elysia";

// Define the schema once to share between route and logic
export const createChildSchema = t.Object({
  firstName: t.String(),
  lastName: t.String(),
  dob: t.String(),
  gender: t.Optional(t.String()),
  medicalInfo: t.Optional(t.String()),
  parentIds: t.Optional(t.Array(t.String())),
});

export type CreateChildBody = Static<typeof createChildSchema>;

export const getChildrenForParent = async (parentId: string) => {
  const today = new Date().toISOString().split("T")[0];

  const result = await db
    .select({
      id: child.id,
      first_name: child.first_name,
      last_name: child.last_name,
      date_of_birth: child.date_of_birth,
      gender: child.gender,
      medical_info: child.medical_info,
      parentId: parentToChild.parent_id,
      // Uses 'sql' helper
      is_present: sql<boolean>`COALESCE(${attendance.status}, false)`.as(
        "is_present",
      ),
    })
    .from(parentToChild)
    .innerJoin(child, eq(parentToChild.child_id, child.id))
    .leftJoin(
      attendance,
      // Uses 'and' helper
      and(
        eq(child.id, attendance.child_id),
        eq(attendance.attendance_date, today),
      ),
    )
    .where(eq(parentToChild.parent_id, parentId));

  return result;
};
export const findAllChildren = async () => {
  return await db.select().from(child);
};

export const findOneChild = async (id: string) => {
  const [data] = await db.select().from(child).where(eq(child.id, id)).limit(1);
  return data || null;
};

export const createChild = async (
  data: CreateChildBody,
  submitterId: string,
) => {
  const childId = randomUUID();

  const [newChild] = await db
    .insert(child)
    .values({
      id: childId,
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dob,
      gender: data.gender ?? "unspecified",
      medical_info: data.medicalInfo ?? null,
    })
    .returning();

  const links = [{ parent_id: submitterId, child_id: childId }];
  if (data.parentIds) {
    for (const pId of data.parentIds) {
      if (pId !== submitterId)
        links.push({ parent_id: pId, child_id: childId });
    }
  }

  await db.insert(parentToChild).values(links);
  return newChild;
};

export const updateChild = async (id: string, data: any) => {
  return await db
    .update(child)
    .set({
      first_name: data.firstName,
      last_name: data.lastName,
      medical_info: data.medicalInfo,
    })
    .where(eq(child.id, id))
    .returning();
};

export const deleteChild = async (id: string) => {
  return await db.delete(child).where(eq(child.id, id));
};
