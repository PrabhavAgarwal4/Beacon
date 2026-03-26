import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

//3 Major configurations
app.use(express.json({
    limit:"1mb"
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb",
}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import studentRouter from "./routes/student.routes.js"
import recruiterRouter from "./routes/recruiter.routes.js"
import jobRouter from "./routes/jobes.routes.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/student",studentRouter)
app.use("/api/v1/recruiter",recruiterRouter)
app.use("/api/v1/job",jobRouter)

export {app}