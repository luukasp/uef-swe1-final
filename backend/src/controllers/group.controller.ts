import db from "../database";
import {eq, sql} from "drizzle-orm";
import {child, group, user} from "../models/schema";
import {randomUUID} from "node:crypto";
import cc from "./child.controller";

export interface Group {
    id?: string;
    teacher_id?: string;
    child_ids?: string[];
}

export default class GroupController {
    static findAll = async () => {
        return db.select().from(group);
    }
    static findOne = async (id: string) => {
        if (id.length != 36) {
            return false;
        }
        return db.select().from(group).where(eq(group.id, id)).limit(1);
    }
    static getChildren = async (id: string) => {
        return db.execute(sql`
            SELECT c.id, c.first_name, c.last_name
            FROM "group" g
                     JOIN "child" c ON c.id = ANY (g.child_ids)
            WHERE g.id = ${id}
            GROUP BY c.id;
        `);
    }
    static getTeacher = async (id: string) => {
        return db.select({teacher_id: group.teacher_id}).from(group).where(eq(group.id, id)).limit(1);
    }
    static create = async (data: Group) => {
        if (!data.teacher_id || !data.child_ids) {
            return false;
        }
        if (!data.teacher_id.length) {
            console.log("Invalid teacher_id");
            return false;
        }
        for (let _child of data.child_ids) {
            if (_child.length != 36) {
                console.log("Invalid child_id");
                return false;
            }
        }
        if (!data.id) {
            data.id = randomUUID();
        }
        console.log(data);
        return db.insert(group).values({
            id: data.id,
            teacher_id: data.teacher_id,
            child_ids: data.child_ids,
        }).returning();
    }
    static createAutomatic = async () => {
        try {
            // Get all children
            const children = await cc.findAll();
            if (!children || children.length === 0) {
                console.log("No children found");
                return false;
            }
            const existingGroups = await this.findAll();
            console.log(existingGroups);
            for (let _eg of existingGroups) {
                console.log("Checking group: " + _eg.id);
                for (let _child of children) {
                    console.log("Check membership of groups for " + _child.id);
                    if (!_eg.child_ids) {
                        console.log("Existing group has no children");
                        continue;
                    }
                    if (_eg.child_ids.includes(_child.id)) {
                        console.log("Child with ID: " + _child.id + " already exists in a group");
                        let idx = children.indexOf(_child);
                        if (idx >= 0) {
                            children.splice(idx, 1);
                            console.log("Removed child: " + _child.id + " from eligible children");
                        }
                    }
                }
            }

            // Get max group size from env or default to 6
            const maxGroupSize = parseInt(process.env.MAX_GROUP_SIZE || "6");

            // Calculate number of groups needed
            const noOfGroups = Math.ceil(children.length / maxGroupSize);

            // Get all teachers already assigned to groups
            const assignedTeachers = await db.select({ teacher_id: group.teacher_id }).from(group);
            const assignedTeacherIds = assignedTeachers.map(t => t.teacher_id);

            // Get available teachers (role = "teacher" and not already assigned)
            let availableTeachers = await db.select({ id: user.id }).from(user)
                .where(sql`${user.role} = 'staff'`);

            if (assignedTeacherIds.length > 0) {
                availableTeachers = availableTeachers.filter(
                    t => !assignedTeacherIds.includes(t.id)
                );
            }

            // Check if we have enough available teachers
            if (availableTeachers.length < noOfGroups) {
                console.log(`Not enough available teachers. Need ${noOfGroups}, found ${availableTeachers.length}`);
                return `Not enough available teachers. Need ${noOfGroups}, found ${availableTeachers.length}`;
            }

            // Divide children evenly into groups
            const groups: Group[] = [];
            let childIndex = 0;

            for (let i = 0; i < noOfGroups; i++) {
                const groupChildIds: string[] = [];

                // Calculate how many children should be in this group
                const remainingChildren = children.length - childIndex;
                const remainingGroups = noOfGroups - i;
                const childrenInThisGroup = Math.ceil(remainingChildren / remainingGroups);

                // Assign children to this group
                for (let j = 0; j < childrenInThisGroup && childIndex < children.length; j++) {
                    groupChildIds.push(children[childIndex].id);
                    childIndex++;
                }

                // Create group object
                groups.push({
                    id: randomUUID(),
                    teacher_id: availableTeachers[i].id,
                    child_ids: groupChildIds,
                });
            }

            // Insert all groups into the database
            const results = [];
            for (const grp of groups) {
                const result = await this.create(grp);
                results.push(result);
            }

            console.log(`Successfully created ${groups.length} groups`);
            return results;
        } catch (error) {
            console.error("Error in createAutomatic:", error);
            return false;
        }
    }
    static delete = async (id: string) => {
        db.delete(group).where(eq(group.id, id));
    }
    static deleteAll = async () => {
        db.delete(group);
    }
}