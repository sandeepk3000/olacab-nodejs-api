import { Rider } from "../models/rider.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult } from "express-validator"
import uploadOncloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import conf from "../conf/conf.js";
import { getAddressCoordinate } from "../services/maps.service.js";

const generateAccessAndRefreshToken = async (id) => {
    try {
        const rider = await Rider.findById(id)
        const accessToken = rider.generateAccesssToken()
        const refreshToken = rider.generateRefreshToken()
        rider.refreshToken = refreshToken
        console.log(rider)
        await rider.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Internal error during generate token")
    }
}
const createRider = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    // if (!errors.isEmpty()) {

    //     throw new ApiError(404, "404 errors ", errors.array())

    // }
    const { firstname, lastname, email, password, role, color, plate, capacity, type, address } = req.body
    if (!color || !plate || !capacity || !type || !address) {
        throw new ApiError(401, "color || plate || capacity || type is required")
    }
    const existedRider = await Rider.findOne({
        $or: [
            { email }
        ]
    })

    if (existedRider) {
        throw new ApiError(409, "Rider already exist")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    const coordinates = await getAddressCoordinate(address)
    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)
    const rider = await Rider.create({
        firstname: firstname,
        lastname: lastname,
        role: role,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email: email,
        password: password,
        vehicle: {
            color: color,
            plate: plate,
            capacity: capacity,
            type: type
        },
        location: coordinates
    })
    const createdRider = await Rider.findById(rider._id).select("-password -refreshToken")
    if (!createdRider) {
        throw new ApiError(500, "Rider is not Register successfully")
    }
    return res.status(201).json(
        new ApiResponse(201, "Rider registered successfully", createdRider, true)
    )

})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const existRider = await Rider.findOne({
        $or: [
            { email: email }
        ]
    })

    if (!existRider) {
        throw new ApiError(401, "Rider is not register")
    }
    const isPasswordValid = await existRider.isPasswordTrue(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existRider._id)
    const loggedInRider = await Rider.findById(existRider._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(201, "Rider Logged in successfully", {
                rider: loggedInRider, accessToken, refreshToken
            }, true)
        )

})
const logout = asyncHandler(async (req, res) => {
    await Rider.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options).
        json(new ApiResponse(200, "Rider logged successfully", {}, true))
})
const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingToken) {
        throw new ApiError(401, "Unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingToken, conf.refreshTokenSecret)
        const rider = await Rider.findById(decodedToken?._id)
        if (!rider) {
            throw new ApiError(401, "Invalid incoming refresh token")
        }
        if (incomingToken !== rider?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(rider._id)
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200,
                    "Access token refreshed",
                    { accessToken, refreshToken },
                    true
                )
            )
    } catch (error) {

    }
})
export {
    createRider,
    login,
    logout,
    refreshAccessToken
}