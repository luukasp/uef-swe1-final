import Router, {Request, Response} from "express";
import ChildController, {Child} from "../controllers/child.controller";

const cr = Router();

cr.get("/", async (req, res) => {
    const b = req.body;
    const c = await ChildController.getChildren(b.parentId);
    res.status(200).send({
        status: 200,
        data: "tbd"
    });
});

cr.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    const newChild: Child = {
        firstName: body.firstName,
        lastName: body.lastName,
        dob: body.dob,
        gender: body.gender,
        medicalInfo: body.medicalInfo,
    } as Child;
    const c = await ChildController.create(newChild);
    return res.status(200).send({
        status: 200,
        data: c
    });
});

cr.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await ChildController.delete(id);
    return res.status(200).send({
        status: 200,
        data: id
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
        data: c
    });
});

export default cr;