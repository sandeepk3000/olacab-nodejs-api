import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult } from "express-validator"
import uploadOncloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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
        avatar: avatar.url,
        coverImage: coverImage.url,
        email: email,
        password: password
    })
    console.log(user);
    
    const createdUser = await User.findById(user._id)
    console.log(createdUser);
    
    if (!createdUser) {
        throw new ApiError(500, "User is not Register successfully")
    }
    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser,true)
    )

})
export {
    createUser,
}