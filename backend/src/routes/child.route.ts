import { Elysia, t } from "elysia";

import {
  createChild,
  deleteChild,
  findAllChildren,
  findOneChild,
  getChildrenForParent,
  updateChild,
  createChildSchema,
} from "../controller/child.controller";
import { isAuthenticated } from "../middleware/auth";

export const childRoutes = new Elysia({ prefix: "/child" })
  .use(isAuthenticated)

  // GET Children for the current parent
  .get("/", async ({ session }) => {
    const data = await getChildrenForParent(session!.user.id);
    return { status: 200, data };
  })

  .get("/mine", async ({ session }) => {
    const data = await getChildrenForParent(session!.user.id);
    return { status: 200, data };
  })

  // GET All children (Admin)
  .get("/list", async () => {
    const data = await findAllChildren();
    return { status: 200, data };
  })

  // GET Single Child
  .get("/:id", async ({ params: { id }, set }) => {
    const data = await findOneChild(id);
    if (!data) {
      set.status = 404;
      return { status: 404, error: "Child not found" };
    }
    return { status: 200, data };
  })

  // POST Create Child
  .post(
    "/",
    async ({ body, session }) => {
      // body is now typed as CreateChildBody automatically
      const data = await createChild(body, session!.user.id);
      return { status: 200, data };
    },
    {
      body: createChildSchema, // Using the schema defined in controller
    },
  )

  // PATCH Update Child
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const data = await updateChild(id, body);
      return { status: 200, data };
    },
    {
      body: t.Partial(
        t.Object({
          firstName: t.String(),
          lastName: t.String(),
          medicalInfo: t.String(),
        }),
      ),
    },
  )

  // DELETE Child
  .delete("/:id", async ({ params: { id } }) => {
    await deleteChild(id);
    return { status: 200, data: id };
  });
