import Router, { Response, NextFunction } from "express";
import { Request } from "@core/express";
import ChildController, { Child } from "../controllers/child.controller";
import requireSession from "../middlewares/requireSession";

const cr = Router();
cr.use(requireSession);

cr.get("/", async (req: Request, res: Response) => {
  const session = await req.session;
  const c = await ChildController.getChildren(session.user.id);
  res.status(200).send({
    status: 200,
    data: c,
  });
});

cr.get("/list", async (req: Request, res: Response) => {
  console.log("Router: Getting all children");
  const c = await ChildController.findAll();
  res.status(200).send({
    status: 200,
    data: c,
  });
});

cr.get("/:id/parents", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const c = await ChildController.getParents(id);
  res.status(200).send({
    status: 200,
    data: c,
  });
});

cr.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const c = await ChildController.findOne(id);
  res.status(200).send({
    status: 200,
    data: c,
  });
});

cr.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const submitterId = req.session.user.id;
  const newChild: Child = {
    firstName: body.firstName,
    lastName: body.lastName,
    dob: body.dob,
    gender: body.gender,
    medicalInfo: body.medicalInfo,
  } as Child;
  let parentIds: string[] = [];
  if (body.parentIds) {
    parentIds = body.parentIds;
  }
  if (parentIds.indexOf(submitterId) === -1) {
    parentIds.push(submitterId);
  }
  newChild.parentIds = parentIds;
  const c = await ChildController.create(newChild, submitterId);
  return res.status(200).send({
    status: 200,
    data: c,
  });
});

cr.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await ChildController.delete(id);
  return res.status(200).send({
    status: 200,
    data: id,
  });
});

cr.patch("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const body = req.body;
  const newChild: Child = {
    firstName: body.firstName,
    lastName: body.lastName,
    medicalInfo: body.medicalInfo,
  } as Child;
  const c = await ChildController.update(id, newChild);
  return res.status(200).send({
    status: 200,
    data: c,
  });
});

export default cr;
