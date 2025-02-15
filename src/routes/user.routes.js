import express from "express"
import { body, check } from "express-validator"
import { createUser, login, logout, refreshAccessToken } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/authMiddleware.js"
const router = express.Router()

router.route("/register-user").post([
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
]), createUser)

router.route("/user-login").post([
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters long"),
], login)
router.route("/user-logout").get(verifyJWT, logout)
router.route("/refreshAccessToken").post(verifyJWT, refreshAccessToken)
export default router