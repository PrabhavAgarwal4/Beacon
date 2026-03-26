import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createJob, getAllJobs, getJobById } from "../controllers/jobes.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/create").post(createJob)
router.route("/").get(getAllJobs)
router.route("/:jobId").get(getJobById)

export default router;