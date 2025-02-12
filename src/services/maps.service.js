import axios from "axios";
import conf from "../conf/conf.js";
import { Rider } from "../models/rider.models.js";
const getAddressCoordinate = async (address) => {
    const url = `https://api.positionstack.com/v1/forward`;
    const params = {
        access_key: '1ab0b604656aa56dab662c7693d17109',
        query: address
    }
    try {
        const response = await axios.get(url, { params })
        if (response.data.data.length !== 0) {
            const location = response.data.data[0];
            return {
                ltd: location.latitude,
                lng: location.longitude
            }
        } else {
            throw new Error("Unable to access coordinates")
        }
    } catch (error) {
        console.log("getAddressCoordinate", error);
        throw error

    }
}
const getRiderInRadius = async (ltd, lng, radius) => {
    const rider = await Rider.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6378.1]// radius in radians
            }
        }
    })
    return rider;
}

const getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required")
    }
    const apiKey = conf.mapMyIndiaApi
    const url = `https://apis.mappls.com/advancedmaps/v1/${apiKey}/distance_matrix/biking/77.983936,28.255904;77.05993,28.487555`
    try {
        const response = await axios.get(url);
        if (response.responseCode === 200) {
            const distanceInKm = response.results.distances[1] / 1000;
            const durationInMin = response.results.durations[1] / 60;
            return {
                distance: distanceInKm,
                duration: durationInMin
            }
        } else {
            throw new Error("Unable to fetch distance and time")
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}
const getAutoSuggestions = async (query) => {
    try {
        if (!query) {
            throw new Error("Query is required")
        }
        const url = `https://atlas.mappls.com/api/places/search/json?query=${query}`
        const response = await axios(url, {
            headers: {
                "Authorization":`Bearer ${conf.mapMyIndiaAccessToken}`,
                "Content-Type":"application/json"
            }
        })

        if (response.status === 200) {
            return response.data.suggestedLocations
        }   
    } catch (error) {
        console.error(error);
        throw error
    }
}
export {
    getAddressCoordinate,
    getRiderInRadius,
    getDistanceTime,
    getAutoSuggestions
}