import { Ride } from "../models/ride.models.js";
import generateOtp from "../services/generateOtp.service.js";
import { getDistanceTime, getRiderInRadius } from "../services/maps.service.js";
import { v4 as generateOrederId } from "uuid"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import getFare from "../utils/calculateFare.js";
const getRideEstimate = async (nearestRiders = [], vehiclestype = [], distance, duration, originLng, originLtd) => {
    let estimate = []
    for (let i = 0; i < vehiclestype.length; i++) {
        const filteredNearestRiders = nearestRiders.filter((rider) => rider.vehicle.type === vehiclestype[i])
        if (filteredNearestRiders.length !== 0) {
            const fare = getFare(vehiclestype[i], distance, duration)
            let minTime = Infinity
            let currentTime = new Date();
            for (const rider of filteredNearestRiders) {
                console.log(rider);
                console.log(rider.location.lng, rider.location.ltd, originLng, originLtd);
                const { duration } = await getDistanceTime(rider.location.lng, rider.location.ltd, originLng, originLtd)
                if (duration < minTime) {
                    minTime = duration
                }
            }
            currentTime.setMinutes(currentTime.getMinutes() + Math.round(minTime))
            let hours = currentTime.getHours()
            let minutes = currentTime.getMinutes()
            let ampm = hours >= 12 ? "PM" : "AM"
            hours = hours % 12 || 12;
            let etaTime = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`
            console.log(etaTime);

            estimate.push({ etaTime, minTime, fare ,vehicletype:vehiclestype[i]})
        }
    }
    return estimate;
}
const getRidesEstimate = asyncHandler(async (req, res) => {
    const { distance, duration, originLng, originLtd } = req.body
    const nearestRiders = await getRiderInRadius(originLtd, originLng, 10)
    const rideEstimates = await getRideEstimate(nearestRiders, ["auto", "car", "bike"], distance, duration, originLng, originLtd)
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Rides Estimate fetched successfully", rideEstimates, true)
        )
})
const createRide = asyncHandler(async (req, res) => {
    const { originlng, originltd, destinationLng, destinationltd, vehicleType } = req.body
    const { distance, duration } = await getDistanceTime(originlng, originltd, destinationLng, destinationltd)
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
        vehicleType: vehicleType,
        payment: {
            fare: getFare(vehicleType, distance, duration)
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
    createRide,
    getRidesEstimate
}