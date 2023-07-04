import Express from "express";
import StudentController from "./controllers/studentController";

const router = Express.Router();

router.use("/", StudentController);

export default router;
