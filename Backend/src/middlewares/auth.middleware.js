import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") //customToken from mobile application

    if (!token) throw new ApiError(401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    throw new ApiError(401, "Invalid token");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied");
  }
  next();
};

export {isAdmin,verifyJWT}