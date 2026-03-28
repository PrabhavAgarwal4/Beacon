import {Router} from "express"
import { getUser, loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import rateLimiter from "../middlewares/rateLimiter.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(rateLimiter(5,60),loginUser)
router.route("/me").get(verifyJWT,getUser)
router.route("/refreshToken").post(refreshAccessToken)


export default router