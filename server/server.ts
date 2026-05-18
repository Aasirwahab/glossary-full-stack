import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import addressRouter from "./routes/addressRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import deliveryPartnerRouter from "./routes/deliveryPartnerRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import deliveryZoneRouter from "./routes/deliveryZoneRoutes.js";
import { stripeWebhook } from "./controllers/webhooks.js";
import { prisma } from "./config/prisma.js";
import { cleanupBlacklistedTokens, cleanupLoginAttempts } from "./controllers/authController.js";

const app = express();

app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for dev; configure properly for production
    crossOriginEmbedderPolicy: false,
}));

// Middleware
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((o) => o.trim()) : [];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Trust proxy for rate limiting behind reverse proxies (Vercel, etc.)
app.set("trust proxy", 1);

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
    res.send("Server is Live!");
});

app.get("/health", async (req: Request, res: Response) => {
    try {
        await prisma.$queryRawUnsafe("SELECT 1");
        res.json({ status: "ok", db: "connected" });
    } catch {
        res.status(503).json({ status: "error", db: "disconnected" });
    }
});
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/addresses", addressRouter);
app.use("/api/admin", adminRouter);
app.use("/api/delivery", deliveryPartnerRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/delivery-zones", deliveryZoneRouter);

// Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({ message: error.message });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);

    // Cleanup expired blacklisted tokens and old login attempts every 6 hours
    setInterval(() => {
        cleanupBlacklistedTokens().catch(console.error);
        cleanupLoginAttempts().catch(console.error);
    }, 6 * 60 * 60 * 1000);
});
