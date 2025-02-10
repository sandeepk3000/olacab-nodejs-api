import mongoose from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import conf from "../conf/conf.js";
const riderSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: [3, "First name must be at least 3 characters long"],
    },
    role: {
        type: String,
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
    avatar: {
        type: String,
    },
    coverImage: {
        type: String,
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
    },
    status: {
        type: String,
        enum: ["online", "offline"]
    },
    vehicle: {
        color: {
            type: String,
            required: true,
        },
        plate: {
            type: String,
            required: true
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, "capacity must be at least 1"]
        },
        type:{
            type:String,
            required:true,
            enum:["car","motorcycle","auto"]
        }
    },
    location: {
        ltd: {
            type: Number
        },
        lng: {
            type: Number
        }
    }

})

riderSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
});

riderSchema.methods.isPasswordTrue = async function (password) {
    return await bcrypt.compare(password, this.password)
};
riderSchema.methods.generateAccesssToken = function () {
    return jwt.sign({
        _id: this._id,
        role: this.role

    }, conf.accessTokenSecret,
        {
            expiresIn: conf.accessTokenExpiry
        })
}

riderSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        role: this.role
    },
        conf.refreshTokenSecret,
        {
            expiresIn: conf.refreshTokenExpiry
        }

    )
}

export const Rider = mongoose.model("Rider", riderSchema)
