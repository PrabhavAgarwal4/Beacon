import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import  pool  from "../config/postgres.js"

const applyToJob = asyncHandler(async(req,res)=>{

})

const getApplicantsForJob = asyncHandler(async(req,res)=>{

})

const getMyApplications = asyncHandler(async(req,res)=>{

})

const updateApplicationStatus = asyncHandler(async(req,res)=>{
    
})

export {applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus}