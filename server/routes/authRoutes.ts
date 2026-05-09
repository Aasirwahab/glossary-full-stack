import express from "express";
import rateLimit from "express-rate-limit";
import { forgotPassword, login, refreshAccessToken, register, resetPassword, verifyEmail } from "../controllers/authController.js";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

const authRouter = express.Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", authLimiter, forgotPassword);
authRouter.post("/reset-password", authLimiter, resetPassword);
authRouter.post("/refresh", refreshAccessToken);

export default authRouter;
