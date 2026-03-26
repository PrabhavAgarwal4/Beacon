import {Router} from "express"
import { approveJob, approveUser, getPendingJobs, getPendingUsers } from "../controllers/admin.controller.js"
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()


router.use(verifyJWT) //apply to all 
router.use(isAdmin)

router.route("/pending-users").get(getPendingUsers)
router.route("/approve-user").post(approveUser)
router.route("/pending-jobs").get(getPendingJobs)
router.route("/approve-job/:jobId").post(approveJob)

export default router