import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { checkDeliveryZone, createDeliveryZone, deleteDeliveryZone, getDeliveryZones, updateDeliveryZone } from "../controllers/deliveryZoneController.js";

const deliveryZoneRouter = express.Router();

deliveryZoneRouter.post("/check", checkDeliveryZone);
deliveryZoneRouter.get("/", auth, admin, getDeliveryZones);
deliveryZoneRouter.post("/", auth, admin, createDeliveryZone);
deliveryZoneRouter.put("/:id", auth, admin, updateDeliveryZone);
deliveryZoneRouter.delete("/:id", auth, admin, deleteDeliveryZone);

export default deliveryZoneRouter;
