import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus
} from "../controllers/application.controller.js";


const router = Router()


router.use(verifyJWT)

router.route("/apply/:jobId").post(applyToJob)                 //student
router.route("/my-applications").get(getMyApplications)        //student
router.route("/job/:jobId/applicants").get(getApplicantsForJob)    //admin,recruiter
router.route("/update-status/:applicationId").post(updateApplicationStatus)   //recruiter

export default router