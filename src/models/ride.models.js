import mongoose from "mongoose"

const rideSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    rider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"rider",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    distance: {
        type: String//in km
    },
    estimatetime: {
        type: Number,// in min
    },
    elapsedtime: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
        default: "pending"
    },
    payment: {
        type: {
            type: String,
            enum: ["cash"],
            default: "cash"
        },
        paymentid: {
            type: String
        },
        fare: {
            type: Number
        },
        status: {
            type: String,
            enum: ["pending", "complete"],
            default: "pending"
        }
    },
    otp:{
        type:String,
        required:true
    }
})

export  const Ride = mongoose.model("Ride",rideSchema)