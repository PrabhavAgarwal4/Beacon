import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import pool from "../config/postgres";

const setRecruiterProfile = asyncHandler(async(req,res)=>{
   const userId = req.user.id
   const {company_name,company_website,company_description,designation,phone} = req.body

   if(!company_description?.trim() || !company_website?.trim() || !company_name?.trim() || !designation?.trim() || !phone?.trim()){
      throw new ApiError(400,"All fields are required")
   }

   const recruiter = await pool.query(
    "INSERT INTO recruiter_details (user_id,company_name,company_website,company_description,designation,phone) VALUES ($1,$2,$3,$4,$5) RETURNING id,company_name,company_website,company_description,designation,phone",[userId,company_name,company_website,company_description,designation,phone]
   )
   if(!recruiter){
    throw new ApiError(400,"Recruiter details not saved")
   }

   return res
   .status(201)
   .json(
    new ApiResponse(201,"Recruiter details saved")
   )
})
const getRecruiterProfile = asyncHandler(async(req,res)=>{
   const userId = req.user.id

   const recruiter = await pool.query(
    "SELECT company_name,company_website,company_description,designation,phone FROM recruiter_details WHERE user_id=$1",[userId]
   )

   if(!recruiter){
    throw new ApiError(404,"Recruiter not found")
   }
   return res
   .status(200)
   .json(
    new ApiResponse(200,{recruiter},"Recruiter details fetched")
   )
})

export {setRecruiterProfile,getRecruiterProfile}