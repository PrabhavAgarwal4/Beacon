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
router.route("/applicants/:jobId").get(getApplicantsForJob)    //admin,recruiter
router.route("/update-status/:applicationId/:status").post(updateApplicationStatus)   //recruiter

export default router