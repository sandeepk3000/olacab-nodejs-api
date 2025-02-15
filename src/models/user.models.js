import mongoose from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import conf from "../conf/conf.js";
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: [3, "First name must be at least 3 characters long"],
    },
    role:{
        type:String,
        required:true
    },
    lastname: {
        type: String,
        minlength: [3, "Last name must be at least 3 characters long"]
    },
    email: {
        type: String,   
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters long"],
    },
    avatar:{
        type:String,
    },
    coverImage:{
        type:String,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    socketId: {
        type: String
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
});

userSchema.methods.isPasswordTrue = async function (password) {   
    return await bcrypt.compare(password,this.password)
};
userSchema.methods.generateAccesssToken = function () {
    return jwt.sign({
        _id: this._id,
        role:this.role

    }, conf.accessTokenSecret,
        {
            expiresIn: conf.accessTokenExpiry
        })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        role:this.role
    },
        conf.refreshTokenSecret,
        {
            expiresIn: conf.refreshTokenExpiry
        }

    )
}

export const User = mongoose.model("User", userSchema)
