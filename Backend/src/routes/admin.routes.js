import {Router} from "express"
import { approveUser, getPendingUsers } from "../controllers/admin.controller"
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware"

const router = Router()


router.use(verifyJWT) //apply to all 
router.use(isAdmin)

router.route("/pending-users").get(getPendingUsers)
router.route("/approve-user").post(approveUser)

export default router