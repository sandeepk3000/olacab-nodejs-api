import express from "express";
const app = express()
import cors from "cors";
import cookieParser from "cookie-parser";
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: "16kb" }))
app.use(cookieParser())

// import routes 

import userRouter from "./routes/user.routes.js"
import riderRouter from "./routes/rider.routes.js"
import mapRouter from "./routes/map.routes.js"
import rideRouter from "./routes/ride.routes.js"
app.use("/api/v1/users", userRouter)
app.use("/api/v1/riders", riderRouter)
app.use("/api/v1/maps", mapRouter)
app.use("/api/v1/rides", rideRouter)
export { app }
