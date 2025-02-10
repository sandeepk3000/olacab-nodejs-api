import express from "express"
import { body, check } from "express-validator"
import { createRider, login, logout, refreshAccessToken } from "../controllers/rider.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/authMiddleware.js"
const router = express.Router()

router.route("/register-rider").post([
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters long"),
    body("firstname").isLength({ min: 3 }).withMessage("Firstname must be at least 3 characters long"),
    body("lastname").isLength({ min: 3 }).withMessage("Lastname must be at least 3 characters long"),
    body("role").isEmpty().withMessage("role is required")
], upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), [
    check("avatar")
        .custom((value, { req }) => {
            if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
                throw new Error("Avatar is required.")
            }
            return true
        }),
    check("coverImage").custom((value, { req }) => {
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            throw new Error("Cover image is required.")
        }
        return true
    })
], createRider)

router.route("/rider-login").post([
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters long"),
], login)
router.route("/rider-logout").get(verifyJWT, logout)
router.route("/refreshAccessToken").post(verifyJWT, refreshAccessToken)
export default router