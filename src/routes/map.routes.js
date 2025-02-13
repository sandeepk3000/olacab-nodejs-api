import express from 'express';
import { query } from 'express-validator';
import verifyJWT from '../middlewares/authMiddleware.js';
import { getGeocoding, getSuggestion } from '../controllers/map.controller.js';
const router = express.Router()

router.route("/get-suggestions").get(
    query("query").isString().isLength({ min: 3 }).withMessage("query contains min 3 charecters"),
    verifyJWT,
    getSuggestion
)

router.route("/get-forward-geocoding").post(
    verifyJWT,
    getGeocoding
)

export default router