import Express from "express";
import healthcheckRoute from "./routes/healthcheckRoute";
import studentRoute from "./routes/studentRoute";
import teacherRoute from "./routes/teacherRoute";

const router = Express.Router();

router.use("/", studentRoute);
router.use("/healthCheck", healthcheckRoute);
router.use("/teachers", teacherRoute);

export default router;
