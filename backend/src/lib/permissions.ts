import {createAccessControl} from "better-auth/plugins/access";
import {defaultStatements, adminAc} from "better-auth/plugins/admin/access";

const permissionStatement = {
    ...defaultStatements,
    allResources: ["allTasks"], // Special superuser permissions.
    attendance: ["create", "update", "delete", "read", "readAll", "updateAny", "deleteAny"],
    child: ["create", "update", "delete", "read", "readAll", "updateAny", "deleteAny"],
} as const;

export const ac = createAccessControl(permissionStatement);

export const administrator = ac.newRole(
    {
        ...adminAc.statements,
        attendance: ["create", "readAll", "updateAny", "deleteAny"],
        child: ["create", "readAll", "deleteAny", "updateAny"]
    }
);

export const parent = ac.newRole({
    ...defaultStatements,
});

export const staff = ac.newRole({
    ...defaultStatements,
});

export const superuser = ac.newRole({
    ...adminAc.statements,
    allResources: ["allTasks"]
});