import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import pool from "../config/postgres.js"
import bcrypt from "bcrypt"


const registerUser = asyncHandler(async(req,res)=>{
    //get details from req.body
    //verify details for requirements
    //hash password
    //save user in database
    //send for admin approval and send res 

    const {name,email,password,role} = req.body //get details

    //verify details
    if(!name?.trim() || !email?.trim() || !password?.trim() || !role?.trim()){  
        throw new ApiError(400,"All fields are required")
    }
    if(password.length < 7){
        throw new ApiError(400,"Length of password must be atleast 7")
    }

    const password_hash = await bcrypt.hash(password,10) //hash password

    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role, status)
        VALUES ($1,$2,$3,$4,'PENDING') RETURNING id,name,email,role,status`,
        [name, email, password_hash, role]
    )

    return res
    .status(201)
    .json(
        new ApiResponse(201,"User registered,waiting for admin approval")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    
})

const getUser = asyncHandler(async(req,res)=>{
    const user = req.user

})

export {registerUser,loginUser,getUser}