import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import pool from "../config/postgres.js";
import { getPublicId,deleteFile,uploadFile } from "../utils/cloudinary.js";

const setStudentProfile = asyncHandler(async(req,res)=>{
   const userId = req.user.id 
   const {rollno,department,course,graduation_year,cgpa,phone} = req.body
   
   //roll check 
   if(req.user.role !== "STUDENT"){
      throw new ApiError(403,"Invalid access! Only students are allowed")
   }

   //duplicate check 
   const existingStudent = await pool.query(
    "SELECT * FROM student_details WHERE user_id=$1",[userId]
   )
   if(existingStudent.rows.length !== 0){
      throw new ApiError(400,"Student already exists")
   }


   if(!rollno || !department?.trim() || !course?.trim() || !phone?.trim() || !graduation_year || !cgpa){
      throw new ApiError(400,"All fields are required")
   }

   const student = await pool.query(
        "INSERT INTO student_details (user_id,rollno,department,course,graduation_year,cgpa,phone) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,rollno,department,course,graduation_year,cgpa",[userId,rollno,department,course,graduation_year,cgpa,phone]
   )

   if(student.rowCount === 0){
      throw new ApiError(400,"Student details failed to save")
   }

   return res
   .status(201)
   .json(
    new ApiResponse(201,"Student details saved")
   )
})


const getStudentProfile = asyncHandler(async(req,res)=>{
   
   const {targetId} = req.params
   if (!targetId) {
      throw new ApiError(400, "Target ID is required");
   }
   
   //student can only view its own profile
   if (req.user.role === "STUDENT" && req.user.id != targetId) {
      throw new ApiError(403, "You can only view your own profile");
   }

   const student = await pool.query(
    'SELECT rollno,department,course,graduation_year,cgpa,phone FROM student_details WHERE user_id=$1',[targetId]
   )

   if(student.rows.length === 0){
    throw new ApiError(404,"Student not found")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200,student.rows[0],"Student details fetched")
   )
})


const uploadResume = asyncHandler(async(req,res)=>{
   const user = req.user
   if(user.role !== "STUDENT"){
      throw new ApiError(403,"Only students are allowed")
   }

   if(!req.file){
      throw new ApiError(400,"No file uploaded")
   }
   
   //now check if there is any older resume link 
   //if yes then delete it from cloudinary
   //upload new one and save link in DB
   
   const existing = await pool.query(
      "SELECT resume_url FROM student_details WHERE user_id=$1",[user.id]
   )
   if(existing.rows.length === 0){
      throw new ApiError(404,"Student profile not found")
   }
   
   const oldResumeURL = existing.rows[0].resume_url

   if(oldResumeURL){
      try{
         await deleteFile(getPublicId(oldResumeURL))
      }catch(err){
         console.log("Old resume deletion failed:",err.message)
      }
   }

   const newResume = await uploadFile(req.file.buffer)
   
   await pool.query(`UPDATE student_details SET resume_url=$1 WHERE user_id=$2`,[newResume.secure_url,user.id])
   
   return res
   .status(200)
   .json(
      new ApiResponse(200,{resume_url:newResume.secure_url},"Resume uploaded")
   )
})

export {setStudentProfile,getStudentProfile,uploadResume}