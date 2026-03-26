import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getStudentProfile, setStudentProfile } from "../controllers/student.controller";

const router = Router()

router.use(verifyJWT)

router.route("/set-student-profile").post(setStudentProfile)
router.route("/get-student-profile").get(getStudentProfile)

export default router