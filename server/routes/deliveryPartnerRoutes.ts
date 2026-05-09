import express from "express";
import rateLimit from "express-rate-limit";
import { cancelDelivery, completeDelivery, getDeliveryDetail, getMyDeliveries, loginPartner, updateDeliveryStatus, updateLocation } from "../controllers/deliveryPartnerController.js";
import deliveryAuth from "../middleware/deliveryAuth.js";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

const deliveryPartnerRouter = express.Router();

deliveryPartnerRouter.post("/login", authLimiter, loginPartner);
deliveryPartnerRouter.get("/my-deliveries", deliveryAuth, getMyDeliveries);
deliveryPartnerRouter.get("/my-deliveries/:id", deliveryAuth, getDeliveryDetail);
deliveryPartnerRouter.put("/my-deliveries/:id/complete", deliveryAuth, completeDelivery);
deliveryPartnerRouter.put("/my-deliveries/:id/cancel", deliveryAuth, cancelDelivery);
deliveryPartnerRouter.put("/my-deliveries/:id/status", deliveryAuth, updateDeliveryStatus);
deliveryPartnerRouter.put("/my-deliveries/:id/location", deliveryAuth, updateLocation);

export default deliveryPartnerRouter;
