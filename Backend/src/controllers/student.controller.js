import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import pool from "../config/postgres.js";
import { getPublicId,deleteFile,uploadFile } from "../utils/cloudinary.js";

const setStudentProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { rollno, department, course, graduation_year, cgpa, phone } = req.body;

    if (req.user.role !== "STUDENT") {
        throw new ApiError(403, "Invalid access! Only students are allowed");
    }

    if (!rollno || !department?.trim() || !course?.trim() || !phone?.trim() || !graduation_year || !cgpa) {
        throw new ApiError(400, "All fields are required");
    }

    const client = await pool.connect(); //start a client for the transaction

    try {
        await client.query('BEGIN');//start transaction

        //upsert student details
        const profileQuery = `
            INSERT INTO student_details (user_id, rollno, department, course, graduation_year, cgpa, phone)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                rollno = EXCLUDED.rollno,
                department = EXCLUDED.department,
                course = EXCLUDED.course,
                graduation_year = EXCLUDED.graduation_year,
                cgpa = EXCLUDED.cgpa,
                phone = EXCLUDED.phone
            RETURNING *;
        `;
        const profileResult = await client.query(profileQuery, [userId, rollno, department, course, graduation_year, cgpa, phone]);

        //reset for admin approval
        const userUpdateQuery = `
            UPDATE users 
            SET status = 'PENDING', is_active = false 
            WHERE id = $1
        `;
        await client.query(userUpdateQuery, [userId]);

        await client.query('COMMIT'); // save changes

        return res
            .status(200)
            .json(
                new ApiResponse(200, profileResult.rows[0], "Profile saved. Waiting for Admin re-approval.")
            );
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Transaction Error:", error);
        throw new ApiError(500, "Failed to update profile and status");
    } finally {
        client.release();
    }
});


const getStudentProfile = asyncHandler(async(req,res)=>{
   
   const {targetId} = req.params
   if (!targetId) {
      throw new ApiError(400, "Target ID is required");
   }
   
   //student can only view its own profile
   if (req.user.role === "STUDENT" && req.user.id != targetId) {
      throw new ApiError(403, "You can only view your own profile");
   }

   const query = `
        SELECT 
            u.name, u.email, 
            s.rollno, s.department, s.course, s.graduation_year, s.cgpa, s.phone, s.resume_url 
        FROM users u
        LEFT JOIN student_details s ON u.id = s.user_id
        WHERE u.id = $1
    `;

    const result = await pool.query(query, [targetId]);

    if (result.rows.length === 0) {
        throw new ApiError(404, "User not found");
    }

    // Check if they are a student but haven't filled details yet
    const studentData = result.rows[0];
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, studentData, "Student profile fetched successfully")
        );
})


const uploadResume = asyncHandler(async(req,res)=>{
   const user = req.user
   if(user.role !== "STUDENT"){
      throw new ApiError(403,"Only students are allowed")
   }

   if(!req.file){
      throw new ApiError(400,"No file uploaded")
   }

   // console.log("Consoling multer file",req.file)
   
   
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

   let newResume;

   try {
     newResume = await uploadFile(req.file.buffer);
   }catch(err){
      console.error("Upload failed:", err);
      throw new ApiError(500, "Resume upload failed");
   }
   
   await pool.query(`UPDATE student_details SET resume_url=$1 WHERE user_id=$2`,[newResume.secure_url,user.id])
   
   return res
   .status(200)
   .json(
      new ApiResponse(200,{resume_url:newResume.secure_url},"Resume uploaded")
   )
})

export {setStudentProfile,getStudentProfile,uploadResume}