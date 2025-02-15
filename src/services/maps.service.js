import axios from "axios";
import conf from "../conf/conf.js";
import { Rider } from "../models/rider.models.js";
const getAddressCoordinate = async (address) => {
    try {
        if (!address) {
            throw new Error("Address is required")
        }
        // const url = `https://us1.locationiq.com/v1/search/structured?street=${street}&city=${city}&state=${state}&country=${country}&postalcode=${postalcode}&format=json&key=${conf.locationiqApi}`;
        const url = `https://us1.locationiq.com/v1/search?q=${address}&limit=1&format=json&key=${conf.locationiqApi}`;

        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (response.status === 200) {
            const location = response.data[0];
            return {
                ltd: location.lat,
                lng: location.lon
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
    try {
        const rider = await Rider.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[ltd, lng], radius / 6378.1]// radius in radians
                }
            }
        })
        return rider;
    } catch (error) {

    }
}

const getDistanceTime = async (originLng, originLtd,destinationLng,destinationLtd) => {
    if (!originLng || !originLtd || !destinationLng || !destinationLtd) {
        throw new Error("lng and ltd are required")
    }
    const apiKey = conf.mapMyIndiaApi
    const url = `https://apis.mappls.com/advancedmaps/v1/${apiKey}/distance_matrix/biking/${originLng},${originLtd};${destinationLng},${destinationLtd}`
    try {
        const response = await axios.get(url);
        if (response.data.responseCode === 200) {
            const distanceInKm = response.data.results.distances[0][1] / 1000;
            const durationInMin = response.data.results.durations[0][1] / 60;
            return {
                distance: distanceInKm,
                duration: durationInMin,
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
                "Content-Type": "application/json"
            }
        })

        if (response.status === 200) {
            return response.data.suggestedLocations
        }
    } catch (error) {
        // console.error(error);
        console.log(error);
        
        // throw error
    }
}
export {
    getAddressCoordinate,
    getRiderInRadius,
    getDistanceTime,
    getAutoSuggestions
}