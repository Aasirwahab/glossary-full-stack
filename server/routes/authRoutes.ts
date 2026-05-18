import express from "express";
import rateLimit from "express-rate-limit";
import { changePassword, forgotPassword, getMe, login, logout, refreshAccessToken, register, resetPassword, updateProfile, verifyEmail } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { message: "Too many refresh attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

const authRouter = express.Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post("/logout", logout);
authRouter.get("/me", auth, getMe);
authRouter.post("/verify-email", authLimiter, verifyEmail);
authRouter.post("/forgot-password", authLimiter, forgotPassword);
authRouter.post("/reset-password", authLimiter, resetPassword);
authRouter.post("/refresh", refreshLimiter, refreshAccessToken);
authRouter.put("/profile", auth, updateProfile);
authRouter.put("/change-password", auth, changePassword);

export default authRouter;
