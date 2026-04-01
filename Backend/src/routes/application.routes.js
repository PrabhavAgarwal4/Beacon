import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getApplicationStatus
} from "../controllers/application.controller.js";
import rateLimiter from "../middlewares/rateLimiter.js";


const router = Router()


router.use(verifyJWT)

router.route("/apply/:jobId").post(rateLimiter(5,900),applyToJob)      //student(ratelimiter -> 5 applications every 15mins)
router.route("/my-applications").get(getMyApplications)        //student
router.route("/job/:jobId/applicants").get(getApplicantsForJob)    //admin,recruiter
router.route("/update-status/:applicationId").post(updateApplicationStatus)   //recruiter
router.route("/application-status").get(getApplicationStatus) //student

export default router