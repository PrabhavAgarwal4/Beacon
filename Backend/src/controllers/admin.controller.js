import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import  pool  from "../config/postgres.js"


const getPendingUsers = asyncHandler(async(req,res)=>{
    const result = await pool.query(
        "SELECT id,name,email,role FROM users where status='PENDING'"
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,result.rows,"Pending users fetched successfully")
    )
})

const approveUser = asyncHandler(async(req,res)=>{
    const userId = req.body.userId

    if(!userId){
        throw new ApiError(400,"User id is required")
    }
    const user = await pool.query(
        "UPDATE users SET status='APPROVED',is_active=true WHERE id=$1",[userId]
    )
    if(!user){
        throw new ApiError(404,"User not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{approved:true},"User approved")
    )
})

const getPendingJobs = asyncHandler(async(req,res)=>{
    const jobs = await pool.query(
        "SELECT * FROM jobs WHERE is_active=false"
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,jobs.rows,"All pending jobs fetched")
    )
})

const approveJob = asyncHandler(async(req,res)=>{
   const {jobId} = req.params
   
   if(!jobId){
    throw new ApiError(400,"Job id is required")
   }

   const job = await pool.query(
    "UPDATE jobs SET is_active=true WHERE id=$1",[jobId]
   )

   if(job.rows.length === 0){
    throw new ApiError(404,"Job not found")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200,{approved:true},"Job approved by Admin")
   )
})

export {getPendingUsers,approveUser,getPendingJobs,approveJob}