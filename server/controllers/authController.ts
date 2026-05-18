import crypto from "crypto";
import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../config/nodemailer.js";

// --- Constants ---
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// --- Helpers ---
const generateAccessToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (id: string, role: string) => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET as string;
    return jwt.sign({ id, role, type: "refresh" }, secret, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

const sanitizeUser = (user: any) => {
    const { password, resetToken, resetTokenExpiry, verificationToken, ...safe } = user;
    return { ...safe, isAdmin: user.role === "admin" };
};

/**
 * Validates password strength for production:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const validatePasswordStrength = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain at least one special character (!@#$%^&*...)";
    return null;
};

/**
 * Check if account is locked due to too many failed login attempts
 */
const isAccountLocked = async (email: string): Promise<{ locked: boolean; retryAfter?: number }> => {
    const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MS);

    const failedAttempts = await prisma.loginAttempt.count({
        where: {
            email: email.toLowerCase(),
            success: false,
            createdAt: { gte: windowStart },
        },
    });

    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        // Find the oldest attempt in the window to calculate retry time
        const oldestAttempt = await prisma.loginAttempt.findFirst({
            where: {
                email: email.toLowerCase(),
                success: false,
                createdAt: { gte: windowStart },
            },
            orderBy: { createdAt: "asc" },
        });

        const retryAfter = oldestAttempt
            ? Math.ceil((oldestAttempt.createdAt.getTime() + LOCKOUT_WINDOW_MS - Date.now()) / 1000)
            : 900;

        return { locked: true, retryAfter: Math.max(retryAfter, 0) };
    }

    return { locked: false };
};

/**
 * Record a login attempt for security tracking
 */
const recordLoginAttempt = async (email: string, ip: string | undefined, success: boolean) => {
    await prisma.loginAttempt.create({
        data: {
            email: email.toLowerCase(),
            ip: ip || null,
            success,
        },
    });

    // If successful, clear previous failed attempts for this email
    if (success) {
        await prisma.loginAttempt.deleteMany({
            where: {
                email: email.toLowerCase(),
                success: false,
            },
        });
    }
};

// --- Controllers ---

// Register
// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
    const { name, email, password, adminInviteToken } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 255);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Strong password validation
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
        return res.status(400).json({ message: passwordError });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: sanitizedEmail } });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Check for admin invite token
    let role = "user";
    if (adminInviteToken) {
        const invite = await prisma.adminInvite.findUnique({ where: { token: adminInviteToken } });
        if (invite && !invite.usedAt && invite.expiresAt > new Date() && invite.email === sanitizedEmail) {
            role = "admin";
            await prisma.adminInvite.update({ where: { id: invite.id }, data: { usedAt: new Date() } });
        }
    }

    const user = await prisma.user.create({
        data: {
            name: sanitizedName,
            email: sanitizedEmail,
            password: hashedPassword,
            verificationToken,
            role,
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

    const sanitizedEmail = email.trim().toLowerCase();
    const clientIp = req.ip || req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim();

    // Check account lockout
    const lockout = await isAccountLocked(sanitizedEmail);
    if (lockout.locked) {
        return res.status(429).json({
            message: `Account temporarily locked due to too many failed login attempts. Please try again in ${Math.ceil((lockout.retryAfter || 900) / 60)} minutes.`,
            retryAfter: lockout.retryAfter,
        });
    }

    const user = await prisma.user.findUnique({ where: { email: sanitizedEmail }, include: { addresses: true } });

    if (!user) {
        // Record failed attempt even for non-existent users (prevents user enumeration timing attacks)
        await recordLoginAttempt(sanitizedEmail, clientIp, false);
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        await recordLoginAttempt(sanitizedEmail, clientIp, false);

        // Check how many attempts remain
        const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MS);
        const failedCount = await prisma.loginAttempt.count({
            where: { email: sanitizedEmail, success: false, createdAt: { gte: windowStart } },
        });
        const remaining = MAX_LOGIN_ATTEMPTS - failedCount;

        if (remaining <= 2 && remaining > 0) {
            return res.status(401).json({ message: `Invalid email or password. ${remaining} attempt(s) remaining before account lockout.` });
        }

        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login — record and clear failed attempts
    await recordLoginAttempt(sanitizedEmail, clientIp, true);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.json({ user: sanitizeUser(user), token: accessToken, refreshToken });
};

// Logout
// POST /api/auth/logout
export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        try {
            const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET as string;
            const decoded = jwt.verify(refreshToken, secret) as { exp?: number };

            // Blacklist the refresh token so it can't be reused
            await prisma.blacklistedToken.create({
                data: {
                    token: refreshToken,
                    expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            }).catch(() => {
                // Token might already be blacklisted — that's fine
            });
        } catch {
            // Invalid token — still allow logout
        }
    }

    res.json({ message: "Logged out successfully" });
};

// Get current user (validates token against DB)
// GET /api/auth/me
export const getMe = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: { addresses: true },
    });

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: sanitizeUser(user) });
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

    // Strong password validation
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
        return res.status(400).json({ message: passwordError });
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

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

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
        // Check if token is blacklisted
        const blacklisted = await prisma.blacklistedToken.findUnique({ where: { token: refreshToken } });
        if (blacklisted) {
            return res.status(401).json({ message: "Token has been revoked" });
        }

        const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET as string;
        const decoded = jwt.verify(refreshToken, secret) as { id: string; role: string; type: string };

        if (decoded.type !== "refresh") {
            return res.status(401).json({ message: "Invalid token type" });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Rotate refresh token: blacklist old one, issue a new one
        await prisma.blacklistedToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date((decoded as any).exp * 1000),
            },
        }).catch(() => { /* already blacklisted */ });

        const newAccessToken = generateAccessToken(user.id, user.role);
        const newRefreshToken = generateRefreshToken(user.id, user.role);

        res.json({ token: newAccessToken, refreshToken: newRefreshToken });
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

    // Sanitize
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedPhone = phone?.trim().slice(0, 20) || "";

    const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
            name: sanitizedName,
            phone: sanitizedPhone,
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

    // Strong password validation
    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
        return res.status(400).json({ message: passwordError });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Prevent reusing the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        return res.status(400).json({ message: "New password must be different from your current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
};

// --- Cleanup job (call periodically or via cron) ---
// Removes expired blacklisted tokens to keep the table clean
export const cleanupBlacklistedTokens = async () => {
    const deleted = await prisma.blacklistedToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
    });
    console.log(`Cleaned up ${deleted.count} expired blacklisted tokens`);
};

// Cleanup old login attempts (older than 24 hours)
export const cleanupLoginAttempts = async () => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deleted = await prisma.loginAttempt.deleteMany({
        where: { createdAt: { lt: cutoff } },
    });
    console.log(`Cleaned up ${deleted.count} old login attempts`);
};
