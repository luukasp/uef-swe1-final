import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { child, group, groupToChild, user } from "../models/schema";
import { findAllChildren } from "./child.controller";
import { GroupType } from "../models/group.schema";

export const findAllGroups = async () => {
  return await db.select().from(group);
};

export const findOneGroup = async (id: string) => {
  const result = await db.select().from(group).where(eq(group.id, id)).limit(1);
  return result[0] || null;
};

export const getGroupChildren = async (groupId: string) => {
  return await db
    .select({
      id: child.id,
      firstName: child.first_name,
      lastName: child.last_name,
    })
    .from(groupToChild)
    .innerJoin(child, eq(groupToChild.child_id, child.id))
    .where(eq(groupToChild.group_id, groupId));
};

export const createGroup = async (data: GroupType) => {
  return await db.transaction(async (tx) => {
    // 1. Insert Group record
    const [newGroup] = await tx
      .insert(group)
      .values({ teacher_id: data.teacherId })
      .returning();

    // 2. Insert Junction table records for children
    if (data.childIds.length > 0) {
      const entries = data.childIds.map((cId) => ({
        group_id: newGroup.id,
        child_id: cId,
      }));
      await tx.insert(groupToChild).values(entries);
    }
    return newGroup;
  });
};

export const createAutomaticGroups = async () => {
  const children = await findAllChildren();
  if (!children.length) return { error: "No children found" };

  // Identify children who don't have a group yet
  const assigned = await db
    .select({ id: groupToChild.child_id })
    .from(groupToChild);
  const assignedIds = new Set(assigned.map((a) => a.id));
  const eligible = children.filter((c) => !assignedIds.has(c.id));

  if (!eligible.length) return { error: "All children are already assigned" };

  // Find teachers who aren't currently leading a group
  const assignedTeachers = await db
    .select({ id: group.teacher_id })
    .from(group);
  const busyTeacherIds = assignedTeachers.map((t) => t.id);

  const availableTeachers = await db
    .select({ id: user.id })
    .from(user)
    .where(
      sql`${user.role} = 'staff' AND ${user.id} NOT IN ${
        busyTeacherIds.length ? busyTeacherIds : ["none"]
      }`,
    );

  const maxGroupSize = 6;
  const neededGroups = Math.ceil(eligible.length / maxGroupSize);

  if (availableTeachers.length < neededGroups) {
    return {
      error: `Need ${neededGroups} teachers, but only found ${availableTeachers.length}`,
    };
  }

  const results = [];
  let childIdx = 0;

  for (let i = 0; i < neededGroups; i++) {
    const remainingChildren = eligible.length - childIdx;
    const remainingGroups = neededGroups - i;
    const size = Math.ceil(remainingChildren / remainingGroups);

    const batch = eligible.slice(childIdx, childIdx + size);
    childIdx += size;

    const res = await createGroup({
      teacherId: availableTeachers[i].id,
      childIds: batch.map((c) => c.id),
    });
    results.push(res);
  }

  return results;
};

export const deleteGroup = async (id: string) => {
  return await db.delete(group).where(eq(group.id, id));
};
