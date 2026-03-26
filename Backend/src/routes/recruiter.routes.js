import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getRecruiterProfile, setRecruiterProfile } from "../controllers/recruiter.controller";

const router = Router()

router.use(verifyJWT)

router.route("/setProfile").post(setRecruiterProfile)
router.route("/getProfile").get(getRecruiterProfile)

export default router