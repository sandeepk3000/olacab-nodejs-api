import { getAutoSuggestions } from "../services/maps.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getSuggestion = asyncHandler(async (req, res, next) => {
    const { query } = req.query;
    const suggestions = await getAutoSuggestions(query)
    return res.
        status(200)
        .json(
            new ApiResponse(200,"suggestion get successfully",suggestions,true)
        )
})
export{
    getSuggestion
}