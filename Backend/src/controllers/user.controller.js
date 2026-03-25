import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import pool from "../config/postgres.js"
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken"



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
    
    if(!result){
        throw new ApiError(400,"User registration unsuccessfull")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201,"User registered,waiting for admin approval")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    //user already veerified whether approved or not using verifyJWT
    const {email,password} = req.body

    if(!email?.trim() || !password?.trim()){
        throw new ApiError(400,"All fields are required")
    }

    const result = await pool.query(
        'SELECT * FROM users WHERE email=$1',[email]
    )
    
    const user = result.rows[0]
    if(!user){
        throw new ApiError(400,"User not found")
    }
    if(user.status !== "APPROVED"){
        throw new ApiError(403,"User not approved by admin")
    }
    if (!user.is_active) {
        throw new ApiError(403, "Account disabled");
    }
    
    const isMatch = await bcrypt.compare(password,user.password_hash)
    if(!isMatch){
        throw new ApiError(400,"Invalid email or password")
    }
    
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    //add refresh token in user 
    await pool.query(
        "UPDATE users SET refresh_token=$1 WHERE id=$2",[refreshToken,user.id]
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{accessToken,refreshToken},"Logged in successfully")
    )
})

const getUser = asyncHandler(async (req, res) => {
  const {userId} = req.body

  if(!userId){
    throw new ApiError(400,"User not found")
  }

  const result = await pool.query(
    "SELECT id,name,email,role,status FROM users WHERE id=$1",
    [userId]
  );

  return res.json(new ApiResponse(200, result.rows[0], "User fetched"));
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const {refreshToken} = req.body

    if(!refreshToken){
        throw new ApiError(400,"Refresh token not found")
    }

    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    )
     
    const result = await pool.query(
        "SELECT * FROM users WHERE id=$1",[decoded.id]
    )

    const user = result.rows[0]
    
    if(user.refresh_token !== refreshToken){
        throw new ApiError(404,"Invalid refresh token")
    }

    const newAccessToken = generateAccessToken(user);
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,{accessToken:newAccessToken},"Access token refreshed")
    )
})


export {registerUser,loginUser,getUser,refreshAccessToken}