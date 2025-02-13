import { Ride } from "../models/ride.models.js";
import generateOtp from "../services/generateOtp.service.js";
import { getDistanceTime, getRiderInRadius } from "../services/maps.service.js";
import { v4 as generateOrederId } from "uuid"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import getFare from "../utils/calculateFare.js";


const createRide = asyncHandler(async (req, res) => {
    const { pickup, destination,vehicleType } = req.body
    const { distance, duration, originGeocode } = await getDistanceTime(pickup, destination)
    const nearestRiders = await getRiderInRadius(originGeocode.ltd, originGeocode.lng, 10)

    if (nearestRiders.length === 0) {
        throw new ApiError(404, "Rider is not available in your given range")
    }
    const otp = generateOtp(6)
    const ride = await Ride.create({
        orderId: generateOrederId(),
        rider: nearestRiders[0]._id,
        user: req.user._id,
        pickup: pickup,
        vehicleType:vehicleType,
        payment: {
            fare: getFare(vehicleType,distance,duration)
        },
        destination: destination,
        distance: distance,
        estimatetime: duration,// in km
        otp: otp
    })
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Ride is created successfully", ride, true)
        )

})

export {
    createRide
}