import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getRecruiterProfile, setRecruiterProfile } from "../controllers/recruiter.controller";

const router = Router()

router.use(verifyJWT)

router.route("/set-recruiter-profile").post(setRecruiterProfile)
router.route("/get-recruiter-profile").get(getRecruiterProfile)

export default router