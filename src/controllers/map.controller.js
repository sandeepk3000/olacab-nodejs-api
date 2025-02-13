import { getAddressCoordinate, getAutoSuggestions } from "../services/maps.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getSuggestion = asyncHandler(async (req, res, next) => {
    const { query } = req.query;
    const suggestions = await getAutoSuggestions(query)
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
export {
    getSuggestion,
    getGeocoding
}