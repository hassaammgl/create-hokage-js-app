import { Router } from "express"
import { validateRequest } from "../middlewares/validation.middleware.js"
import {
    register,
    login,
} from "../validations/auth.validation.js"
import {
    registerUser,
    loginUser,
    logoutUser,
} from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middlewares.js"

const router = Router()

router.post('/register', validateRequest(register), registerUser)
router.post('/login', validateRequest(login), loginUser)
router.post('/logout', protect, logoutUser)


export default router;