import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getStudentProfile, setStudentProfile } from "../controllers/student.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/setProfile").post(setStudentProfile)
router.route("/getProfile/:targetId").get(getStudentProfile)

export default router