import express from "express"
import { body, check } from "express-validator"
import { createUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
const router = express.Router()

router.route("/register-user").post([
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters long"),
    body("firstname").isLength({ min: 3 }).withMessage("Firstname must be at least 3 characters long"),
    body("lastname").isLength({ min: 3 }).withMessage("Lastname must be at least 3 characters long")
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
], createUser)

// router.route("/login", [
//     body("email").isEmail().withMessage("Invalid Email"),
//     body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters long"),
// ], login)

// router.route("/logout", logout)

export default router