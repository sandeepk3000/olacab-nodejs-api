
const vehiclecharges = {
    car_fare_per_km: 13,
    bike_fare_per_km: 3,
    auto_fare_per_km: 10
}
const getFare = (vehicletype, distance, time, surge = 1) => {
    let fare = 0;
    switch (vehicletype) {
        case "bike":
            fare = (vehiclecharges.bike_fare_per_km * distance) + (2 * time) + surge
            break;
        case "car":
            fare = (vehiclecharges.car_fare_per_km * distance) + (2 * time) + surge
            break
        case "auto":
            fare = (vehiclecharges.auto_fare_per_km * distance) + (2 * time) + surge
            break;
    }

    return fare
}

export default getFare