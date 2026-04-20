import database from "../database";
import {child, parentToChild, user} from "../models/schema";
import {eq} from "drizzle-orm";
import {randomUUID} from "node:crypto";

export interface Child {
    id?: string;
    firstName?: string;
    lastName?: string;
    dob?: Date;
    gender?: string;
    medicalInfo?: string;
    parentIds?: string[];
}

export default class ChildController {
    static findAll = async () => {
        let _ = database.select().from(child);
        return await _;
    }
    static findOne = async (id: string) => {
        if (id.length != 36) {
            return false;
        }
        let _ = database.select().from(child).where(eq(child.id, id));
        return await _;
    }
    static getParents = async (id: string) => {
        let _ = database.select().from(child).where(eq(child.id, id))
            .leftJoin(parentToChild, eq(child.id, parentToChild.child_id))
            .leftJoin(user, eq(parentToChild.parent_id, user.id));
        return await _;
    }
    // Select children of a specific parent
    static getChildren = async (id: string) => {
        let _ = database.select().from(user).where(eq(user.id, id))
            .rightJoin(parentToChild, eq(user.id, parentToChild.parent_id))
            .rightJoin(child, eq(parentToChild.child_id, child.id));
        return await _;
    }
    static create = async (data: Child) => {
        data.id = randomUUID();
        if (!(
            data.firstName &&
            data.lastName &&
            data.dob &&
            data.gender //&&
            //data.parentIds
            )
        ) {
            return false;
        }
        let c = await database.insert(child)
            .values({
                id: data.id,
                first_name: data.firstName,
                last_name: data.lastName,
                date_of_birth: data.dob,
                gender: data.gender,
                medical_info: data.medicalInfo
            });

        /**for (let parentId of data.parentIds) {
            await database.insert(parentToChild)
                .values({
                    parent_id: parentId,
                    child_id: data.id,
                });
        }*/
        return c;
    }
    static update = async (id: string, data: Child) => {
        return await database.update(child).set({
            first_name: data.firstName,
            last_name: data.lastName,
            medical_info: data.medicalInfo,
        }).where(eq(child.id, id));
    }

    static delete = async (id: string) => {
        return await database.delete(child).where(eq(child.id, id));
    }
}