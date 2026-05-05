import {Request} from "@core/express";
import Router, {Response, NextFunction} from "express";
import requireSession from "../middlewares/requireSession";
import requirePermissions from "#/middlewares/requirePermissions";
import gc, {Group} from "../controllers/group.controller"

const router = Router();
router.use(requireSession);

router.get("/", async (req: Request, res: Response) => {
    const data = await gc.findAll();
    console.log(data);
    res.status(200).json({
        status: 200,
        data: data,
    });
});

router.post("/", async (req: Request, res: Response) => {
   let body = req.body;
   const group: Group = {
       teacher_id: body.teacherId,
       child_ids: body.childIds
   } as Group;
   let data = await gc.create(group);
   if (data) {
       res.status(200).json({
           status: 200,
           data: data,
       });
   }
   else {
       res.status(400).json({
           status: 400,
           error: "Bad Request",
       });
   }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = await gc.findOne(id);
    if (!data) {
        res.status(404).json({
            status: 404,
            error: "The specified group could not be found",
        });
    }
    else {
        res.status(200).json({
            status: 200,
            data: data,
        });
    }
});

router.post("/auto", async (req: Request, res: Response) => {
    const data = await gc.createAutomatic();
    if (data) {
        res.status(200).json({
            status: 200,
            data: data,
        });
    }
    else {
        res.status(400).json({
            status: 400,
            error: "Bad Request",
        });
    }
});

router.delete("/all", async (req: Request, res: Response) => {
    console.log("Attempting to delete");
    await gc.deleteAll();
    res.status(204);
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await gc.delete(id);
    res.status(204);
});

export default router;