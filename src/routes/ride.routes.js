import express from "express"
import verifyJWT from "../middlewares/authMiddleware.js"
import { createRide, getRidesEstimate } from "../controllers/ride.controller.js"
const router = express.Router()

router.route("/create-ride").post(verifyJWT,createRide)
router.route("/estimate").post(verifyJWT,getRidesEstimate)
export default router