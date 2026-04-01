import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createJob, deleteJob, getAllJobs, getJobById, getMyPostedJobs, toggleJobStatus, updateJob } from "../controllers/jobes.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/create").post(createJob)
router.route("/").get(getAllJobs)
router.route("/:jobId").get(getJobById)
router.route("/toggle-status/:jobId").post(toggleJobStatus)
router.route("/update/:jobId").post(updateJob)
router.route("/delete/:jobId").post(deleteJob)
router.route("/my-job").get(getMyPostedJobs)

export default router;