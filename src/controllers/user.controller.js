import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult } from "express-validator"
import uploadOncloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
const generateAccessAndRefreshToken = async (id) => {
    try {
        const user = await User.findById(id)
        const accessToken = user.generateAccesssToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Internal error during generate token")
    }
}
const createUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    // if (!errors.isEmpty()) {

    //     throw new ApiError(404, "404 errors ", errors.array())

    // }
    const { firstname, lastname, email, password } = req.body
    const existedUser = await User.findOne({
        $or: [
            { email }
        ]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exist")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)
    const user = await User.create({
        firstname: firstname,
        lastname: lastname,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email: email,
        password: password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "User is not Register successfully")
    }
    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser, true)
    )

})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const existUser = await User.findOne({
        $or: [
            { email: email }
        ]
    })
    if (!existUser) {
        throw new ApiError(401, "User is not register")
    }
    const isPasswordValid = await existUser.isPasswordTrue(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existUser._id)

    const loggedInUser = await User.findById(existUser._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(201, "User Logged in successfully", {
                user: loggedInUser, accessToken, refreshToken
            }, true)
        )

})
export {
    createUser,
    login
}