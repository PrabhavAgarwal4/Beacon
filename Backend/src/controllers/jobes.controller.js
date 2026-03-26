import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import  pool  from "../config/postgres.js"

const createJob = asyncHandler(async(req,res)=>{
   const user = req.user

   if(user.role !== "RECRUITER"){
    throw new ApiError(400,"Invalid request")
   }

   const {title,description,job_type,location,stipend_or_ctc,minimum_cgpa,skills_required,application_deadline} = req.body
   
   if([title, description, job_type, location, stipend_or_ctc, skills_required].some(field => !field?.trim()) || !minimum_cgpa || !application_deadline){
       throw new ApiError(400,"All fields are required")
   }

   if(isNaN(minimum_cgpa) || minimum_cgpa < 0 || minimum_cgpa > 10){
      throw new ApiError(400,"Invalid cgpa")
   }

   const job = await pool.query(
    "INSERT INTO jobs (recruiter_id,title,description,job_type,location,stipend_or_ctc,minimum_cgpa,skills_required,application_deadline,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[user.id,title,description,job_type,location,stipend_or_ctc,minimum_cgpa,skills_required,application_deadline,"CLOSE"]
   )
   
   if(job.rowCount === 0){
    throw new ApiError(400,"Failed to create job")
   }
    
    return res
    .status(201)
    .json(
        new ApiResponse(201,job.rows[0],"Job created")
    )
})

const getAllJobs = asyncHandler(async(req,res)=>{
   const jobs = await pool.query(
    "SELECT * FROM jobs ORDER BY created_at DESC"
   );

  return res.json(
    new ApiResponse(200, jobs.rows, "All Jobs fetched")
  );

})

const getJobById = asyncHandler(async(req,res)=>{
   const {jobId} = req.params

   if(!jobId){
    throw new ApiError(400,"Job id is required")
   }

   const job = await pool.query(
    "SELECT * FROM jobs WHERE id=$1",[jobId]
   )
   
   if(job.rows.length === 0){
    throw new ApiError(404,"Job not found")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200,job.rows[0],"Job fetched")
   )
})

export {createJob,getAllJobs,getJobById}