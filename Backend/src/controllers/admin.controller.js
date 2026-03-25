import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { pool } from "../config/postgres.js"


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
    const {userId} = req.body
    if(!userId){
        throw new ApiError(400,"User id is required")
    }
    const user = await pool.query(
        "UPDATE users SET status='' WHERE id=$1",[userId]
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

export {getPendingUsers,approveUser}