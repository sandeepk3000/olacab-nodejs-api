import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler"
import ApiError from "../utils/ApiError"
import conf from "../conf/conf"

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, conf.accessTokenSecret)
        let user;

        if (decodedToken?.role === "user") {
            user = await User.findById(decodedToken._id)
        }
        // else if(decodedToken?.role === "captian"){
        //     user = await Captain
        // }
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
