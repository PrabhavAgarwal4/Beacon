import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import  pool  from "../config/postgres.js"

const createJob = asyncHandler(async(req,res)=>{
   const user = req.user
   if(user.role !== "RECRUITER"){
    throw new ApiError(403,"Invalid request!Only recruiter is allowed")
   }

   const {title,description,job_type,location,stipend_or_ctc,minimum_cgpa,skills_required,application_deadline} = req.body
   
   if([title, description, job_type, location, stipend_or_ctc, skills_required].some(field => !field?.trim()) || !minimum_cgpa || !application_deadline){
       throw new ApiError(400,"All fields are required")
   }

   if(isNaN(minimum_cgpa) || minimum_cgpa < 0 || minimum_cgpa > 10){
      throw new ApiError(400,"Invalid cgpa")
   }

   const job = await pool.query(
    "INSERT INTO jobs (recruiter_id,title,description,job_type,location,stipend_or_ctc,minimum_cgpa,skills_required,application_deadline) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",[user.id,title,description,job_type,location,stipend_or_ctc,minimum_cgpa,skills_required,application_deadline]
   )
   
   if(job.rowCount === 0){
    throw new ApiError(400,"Failed to create job")
   }
    
    return res
    .status(201)
    .json(
        new ApiResponse(201,job.rows[0],"Job created,waiting for admin approval")
    )
})

const getAllJobs = asyncHandler(async(req,res)=>{
   
    const {page=1,limit=10,location,job_type,min_cgpa} = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    const offset = (page-1)*limit

    //dynamic query building
    let query = `SELECT * FROM jobs WHERE is_active=true AND stats='OPEN`
    const values = [] 
    let index = 1
    
    //Filters
    if(location){
        query+= `AND location ILIKE $${index++}`
        values.push(`%${location}%`)
    }
    if(job_type){
        query+= `AND job_type = $${index++}`
        values.push(job_type)
    }
    if(min_cgpa){
        query+= `AND minimum_cgpa = $${index++}`
        values.push(min_cgpa)
    }

    //Pagination
    query+= `ORDER BY created_at DESC LIMIT $${index++} OFFSET $${index++}`
    values.push(limit,offset)

    const jobs = await pool.query(query,values)

    const countQuery = `SELECT COUNT(*) FROM jobs WHERE is_active=true AND status="OPEN"`

    const totalResult = await pool.query(countQuery)
    const totalJobs = parseInt(totalResult.rows[0].count)

    return res
    .status(200)
    .json(
        new ApiResponse(200,{
          jobs:jobs.rows,
          total:totalJobs,
          page,
          totalPages:Math.ceil(totalJobs/limit)
        },"Jobs fetched")
    )
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

const toggleJobStatus = asyncHandler(async(req,res)=>{
    //can only be toggled by same recruiter 
    const user = req.user
    const {jobId} = req.params

    if(!jobId){
        throw new ApiError(400,"Job id is required")
    }
    if(user.role !== "RECRUITER"){
        throw new ApiError(403,"Only Recruiter allowed")
    }
    //access check 
    const result = await pool.query(
        "SELECT recruiter_id,status FROM jobs WHERE id=$1",[jobId]
    )
    if(result.rows.length === 0){
        throw new ApiError(404,"Job not found")
    }
    const recruiterId = result.rows[0].recruiter_id
    let jobStatus = result.rows[0].status
    if(recruiterId !== user.id){
        throw new ApiError(403,"Invalid request/access")
    }

    //now toggle job status
    jobStatus = jobStatus === "OPEN" ? "CLOSED" : "OPEN";

    const job = await pool.query(
        "UPDATE jobs SET status=$1 WHERE id=$2 RETURNING *",[jobStatus,jobId]
    )
    if(job.rows.length === 0){
        throw new ApiError(404,"Job status updation failed")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,"Job status toggled")
    )
})

export {createJob,getAllJobs,getJobById,toggleJobStatus}