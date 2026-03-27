import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getStudentProfile, setStudentProfile, uploadResume } from "../controllers/student.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/setProfile").post(setStudentProfile)
router.route("/getProfile/:targetId").get(getStudentProfile)
router.route("/upload-resume").post(
    upload.single("resume"),
    uploadResume
)

export default router