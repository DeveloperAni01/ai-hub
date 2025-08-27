import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    userProfile,
} from "../controllers/user.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authUser, userProfile);
router.get("/logout", authUser, logoutUser);

export default router;
