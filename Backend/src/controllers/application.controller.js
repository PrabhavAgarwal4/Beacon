import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import  pool  from "../config/postgres.js"

const applyToJob = asyncHandler(async(req,res)=>{
   const user = req.user
   const {jobId} = req.params
   
   if(!jobId){
    throw new ApiError(400,"Job id is not given")
   }

   if(user.role !== "STUDENT"){
        throw new ApiError(403,"Only students can apply")
    }
   
    const job = await pool.query(
        "SELECT * FROM jobs WHERE id=$1",[jobId]
    )
    if(job.rows.length === 0){
        throw new ApiError(404,"Job not found")
    }
    const jobData = job.rows[0]

    if(!jobData.is_active || jobData.status!=="OPEN"){
      throw new ApiError(400,"Job not open for applications")
    }

   try {
    const application = await pool.query(
     "INSERT INTO applications (job_id,student_user_id) VALUES ($1,$2) RETURNING *",[jobId,user.id]
    )
    
    return res
    .status(201)
    .json(
        new ApiResponse(201,application.rows[0],"Applied successfully")
    )
   } catch (error) {
      if(error.code = "23505"){
        throw new ApiError(400,"Already applied")
      }
   }
})

const getApplicantsForJob = asyncHandler(async(req,res)=>{
    const {jobId} = req.params
    if(!jobId){
        throw new ApiError(400,"Job id is not given")
    }

    if(user.role !== "RECRUITER" && user.role !== "ADMIN"){
        throw new ApiError(400,"Invalid access")
    }

    const applicants = await pool.query(
        "SELECT * FROM applications WHERE job_id=$1",[jobId]
    )

    if(applicants.rows.length === 0){
        throw new ApiError(404,"No applicant or job not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,applicants.rows,"All applicants fetched")
    )
})

const getMyApplications = asyncHandler(async(req,res)=>{
    const user = req.user

    if(user.role !== "STUDENT"){
        throw new ApiError(400,"Only students are allowed")
    }

    const myApplications = await pool.query(
        "SELECT * FROM applications WHERE student_user_id=$1",[user.id]
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,myApplications.rows,"All applications of user fetched")
    )
})

const updateApplicationStatus = asyncHandler(async(req,res)=>{
    const {applicationId,status} = req.params
    if(!applicationId){
        throw new ApiError(400,"Application id is not given")
    }
    
    if(user.role !== "RECRUITER"){
        throw new ApiError(400,"Only recruiters are allowed")
    }

    const application = await pool.query(
        "UPDATE applications SET status=$1 WHERE id=$2 RETURNING *",[status,applicationId]
    )
    
    if(application.rowCount === 0){
        throw new ApiError(404,"Application not found")
    }
     
    return res
    .status(200)
    .json(
        new ApiResponse(200,{updated:true},"Application status updated")
    )
})

export {applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus}