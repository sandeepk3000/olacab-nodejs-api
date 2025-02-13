import express from "express"
import verifyJWT from "../middlewares/authMiddleware.js"
import { createRide } from "../controllers/ride.controller.js"
const router = express.Router()

router.route("/create-ride").post(verifyJWT,createRide)

export default router