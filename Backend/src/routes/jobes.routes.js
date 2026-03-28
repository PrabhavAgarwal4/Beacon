import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createJob, deleteJob, getAllJobs, getJobById, toggleJobStatus, updateJob } from "../controllers/jobes.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/create").post(createJob)
router.route("/").get(getAllJobs)
router.route("/:jobId").get(getJobById)
router.route("/toggle-status/:jobId").post(toggleJobStatus)
router.route("/update-job/:jobId").post(updateJob)
router.route("/delete").post(deleteJob)

export default router;