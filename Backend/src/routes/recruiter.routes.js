import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getRecruiterProfile, setRecruiterProfile } from "../controllers/recruiter.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/setProfile").post(setRecruiterProfile)
router.route("/getProfile/:targetId").get(getRecruiterProfile)

export default router