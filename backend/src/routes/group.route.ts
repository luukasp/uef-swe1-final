import { Elysia, t } from "elysia";

import {
  findAllGroups,
  findOneGroup,
  createGroup,
  createAutomaticGroups,
  deleteGroup,
  getGroupChildren,
} from "../controller/group.controller";
import { GroupSchema } from "../models/group.schema";
import { isAuthenticated } from "../middleware/auth";

export const groupRoutes = new Elysia({ prefix: "/group" })
  .use(isAuthenticated)

  .get("/", () => findAllGroups())

  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const data = await findOneGroup(id);
      if (!data) {
        set.status = 404;
        return { error: "Group not found" };
      }
      const children = await getGroupChildren(id);
      return { ...data, children };
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )

  .post(
    "/",
    async ({ body }) => {
      return await createGroup(body);
    },
    {
      body: GroupSchema,
    },
  )

  .post("/auto", async ({ set }) => {
    const result = await createAutomaticGroups();
    if ("error" in result) {
      set.status = 400;
      return result;
    }
    return result;
  })

  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await deleteGroup(id);
      return { success: true };
    },
    {
      params: t.Object({ id: t.String() }),
    },
  );
