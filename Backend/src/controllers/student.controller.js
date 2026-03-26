import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import pool from "../config/postgres";

const setStudentProfile = asyncHandler(async(req,res)=>{
   const userId = req.user.id 
   const {rollno,department,course,graduation_year,cgpa,phone} = req.body
   
   //roll check 
   if(req.user.role !== "STUDENT"){
      throw new ApiError(403,"Invalid access! Only students are allowed")
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


export {setStudentProfile,getStudentProfile}