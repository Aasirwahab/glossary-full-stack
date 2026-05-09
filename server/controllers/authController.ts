import crypto from "crypto";
import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../config/nodemailer.js";

const generateAccessToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

const generateRefreshToken = (id: string, role: string) => {
    return jwt.sign({ id, role, type: "refresh" }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
};

const sanitizeUser = (user: any) => {
    const { password, resetToken, resetTokenExpiry, verificationToken, ...safe } = user;
    return { ...safe, isAdmin: user.role === "admin" };
};

// Register
// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            verificationToken,
        },
    });

    // Send verification email (non-blocking — don't fail registration if email fails)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    sendEmail({
        to: user.email,
        subject: "Verify your email - Instacart",
        body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 24px 28px;">
                <h2 style="color: #fff; margin: 0; font-size: 20px;">Welcome to Instacart!</h2>
            </div>
            <div style="padding: 28px;">
                <p style="font-size: 15px; color: #374151;">Hi <strong>${user.name}</strong>, please verify your email to get started.</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${clientUrl}/verify-email?token=${verificationToken}"
                       style="display: inline-block; background: #16a34a; color: #fff; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">
                       Verify Email
                    </a>
                </div>
                <p style="font-size: 13px; color: #9ca3af;">If you didn't create this account, you can ignore this email.</p>
            </div>
        </div>`,
    }).catch((err) => console.log("Verification email failed:", err.message));

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.status(201).json({ user: sanitizeUser(user), token: accessToken, refreshToken });
};

// Login
// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, include: { addresses: true } });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.json({ user: sanitizeUser(user), token: accessToken, refreshToken });
};

// Verify Email
// POST /api/auth/verify-email
export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await prisma.user.findFirst({ where: { verificationToken: token } });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, verificationToken: null },
    });

    res.json({ message: "Email verified successfully" });
};

// Forgot Password
// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Please provide your email" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
        return res.json({ message: "If an account with that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: resetTokenHash, resetTokenExpiry },
    });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    try {
        await sendEmail({
            to: user.email,
            subject: "Reset your password - Instacart",
            body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 24px 28px;">
                    <h2 style="color: #fff; margin: 0; font-size: 20px;">Password Reset</h2>
                </div>
                <div style="padding: 28px;">
                    <p style="font-size: 15px; color: #374151;">Hi <strong>${user.name}</strong>, we received a request to reset your password.</p>
                    <div style="text-align: center; margin: 24px 0;">
                        <a href="${clientUrl}/reset-password?token=${resetToken}"
                           style="display: inline-block; background: #f97316; color: #fff; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">
                           Reset Password
                        </a>
                    </div>
                    <p style="font-size: 13px; color: #9ca3af;">This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
                </div>
            </div>`,
        });
    } catch (err: any) {
        console.log("Reset email failed:", err.message);
        return res.status(500).json({ message: "Failed to send reset email. Please check SMTP configuration." });
    }

    res.json({ message: "If an account with that email exists, a reset link has been sent." });
};

// Reset Password
// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            resetToken: resetTokenHash,
            resetTokenExpiry: { gte: new Date() },
        },
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    res.json({ message: "Password reset successfully. You can now log in." });
};

// Refresh Token
// POST /api/auth/refresh
export const refreshAccessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as { id: string; role: string; type: string };

        if (decoded.type !== "refresh") {
            return res.status(401).json({ message: "Invalid token type" });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const newAccessToken = generateAccessToken(user.id, user.role);
        res.json({ token: newAccessToken });
    } catch {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

// Update Profile
// PUT /api/auth/profile
export const updateProfile = async (req: Request, res: Response) => {
    const { name, phone } = req.body;

    if (!name?.trim()) {
        return res.status(400).json({ message: "Name is required" });
    }

    const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
            name: name.trim(),
            phone: phone?.trim() || "",
        },
        include: { addresses: true },
    });

    res.json({ user: sanitizeUser(user) });
};

// Change Password
// PUT /api/auth/change-password
export const changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
};
