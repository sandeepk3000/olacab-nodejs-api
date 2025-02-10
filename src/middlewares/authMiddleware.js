import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import conf from "../conf/conf.js"
import { User } from "../models/user.models.js"
import { Rider } from "../models/rider.models.js"
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, conf.accessTokenSecret)
        let user;
        if (decodedToken?.role === "user") {
            user = await User.findById(decodedToken._id).select("-password -refreshToken")
        } else if (decodedToken?.role === "rider") {
            user = await Rider.findById(decodedToken._id).select("-password -refreshToken")
        }
        else {
            throw new ApiError(401, "Invalid Access Token")
        }
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user

        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export default verifyJWT;
