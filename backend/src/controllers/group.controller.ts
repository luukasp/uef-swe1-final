import db from "../database";
import { eq, sql, inArray } from "drizzle-orm";
import { child, group, groupToChild, user } from "../models/schema";
import { randomUUID } from "node:crypto";
import cc from "./child.controller";

export interface Group {
  id?: string;
  teacher_id?: string;
  child_ids?: string[]; // We keep this in the interface for the API to send/receive
}

export default class GroupController {
  static findAll = async () => {
    return db.select().from(group);
  };

  static findOne = async (id: string) => {
    if (id.length != 36) return false;
    return db.select().from(group).where(eq(group.id, id)).limit(1);
  };

  // UPDATED: Now uses the junction table to find children
  static getChildren = async (id: string) => {
    return db
      .select({
        id: child.id,
        first_name: child.first_name,
        last_name: child.last_name,
      })
      .from(groupToChild)
      .innerJoin(child, eq(groupToChild.child_id, child.id))
      .where(eq(groupToChild.group_id, id));
  };

  static getTeacher = async (id: string) => {
    return db
      .select({ teacher_id: group.teacher_id })
      .from(group)
      .where(eq(group.id, id))
      .limit(1);
  };

  // UPDATED: Handles two tables now
  static create = async (data: Group) => {
    if (!data.teacher_id || !data.child_ids) return false;
    if (!data.teacher_id.length) return false;

    const groupId = data.id || randomUUID();

    // 1. Insert Group
    const newGroup = await db
      .insert(group)
      .values({
        id: groupId,
        teacher_id: data.teacher_id,
      })
      .returning();

    // 2. Insert Junction Entries
    if (data.child_ids.length > 0) {
      const entries = data.child_ids.map((cId) => ({
        group_id: groupId,
        child_id: cId,
      }));
      await db.insert(groupToChild).values(entries);
    }

    return newGroup;
  };

  static createAutomatic = async () => {
    try {
      const children = await cc.findAll();
      if (!children || children.length === 0) return false;

      // Get all children already in any group
      const existingMembers = await db
        .select({ child_id: groupToChild.child_id })
        .from(groupToChild);
      const memberIds = existingMembers.map((m) => m.child_id);

      // Filter out children who are already assigned
      const eligibleChildren = children.filter(
        (c) => !memberIds.includes(c.id),
      );

      if (eligibleChildren.length === 0) return "No unassigned children found";

      const maxGroupSize = parseInt(process.env.MAX_GROUP_SIZE || "6");
      const noOfGroups = Math.ceil(eligibleChildren.length / maxGroupSize);

      const assignedTeachers = await db
        .select({ id: group.teacher_id })
        .from(group);
      const assignedIds = assignedTeachers.map((t) => t.id);

      let availableTeachers = await db
        .select({ id: user.id })
        .from(user)
        .where(sql`${user.role} = 'staff'`);

      availableTeachers = availableTeachers.filter(
        (t) => !assignedIds.includes(t.id),
      );

      if (availableTeachers.length < noOfGroups) {
        return `Need ${noOfGroups} teachers, found ${availableTeachers.length}`;
      }

      const results = [];
      let childIndex = 0;

      for (let i = 0; i < noOfGroups; i++) {
        const remainingChildren = eligibleChildren.length - childIndex;
        const remainingGroups = noOfGroups - i;
        const size = Math.ceil(remainingChildren / remainingGroups);

        const currentBatch = eligibleChildren.slice(
          childIndex,
          childIndex + size,
        );
        childIndex += size;

        const res = await this.create({
          teacher_id: availableTeachers[i].id,
          child_ids: currentBatch.map((c) => c.id),
        });
        results.push(res);
      }

      return results;
    } catch (error) {
      console.error("Error in createAutomatic:", error);
      return false;
    }
  };

  static delete = async (id: string) => {
    // Note: If you set onDelete: "cascade" in schema,
    // the junction table entries will delete automatically.
    return db.delete(group).where(eq(group.id, id));
  };

  static deleteAll = async () => {
    return db.delete(group);
  };
}
