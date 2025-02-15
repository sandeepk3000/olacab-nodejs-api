import { getAddressCoordinate, getAutoSuggestions, getDistanceTime } from "../services/maps.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getSuggestion = asyncHandler(async (req, res, next) => {
    const { query } = req.query;
    console.log(query);

    const suggestions = await getAutoSuggestions(query)
    console.log(suggestions);

    return res.
        status(200)
        .json(
            new ApiResponse(200, "suggestion get successfully", suggestions, true)
        )
})
const getGeocoding = asyncHandler(async (req, res, next) => {
    const { address } = req.body
    const geocode = await getAddressCoordinate(address)
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Address converted in geocode", geocode, true)
        )
})
const getDistanceMatrix = asyncHandler(async (req, res, next) => {
    const { originLng, originLtd, destinationLng, destinationLtd } = req.body
    const distanceMatrix = await getDistanceTime(originLng, originLtd, destinationLng, destinationLtd)
    return res
        .status(200)
        .json(
            new ApiResponse(200, "Distance and duration fetched successfully", distanceMatrix, true)
        )
})
export {
    getSuggestion,
    getGeocoding,
    getDistanceMatrix
}