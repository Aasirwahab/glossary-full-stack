import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { acceptAdminInvite, assignDeliveryPartner, cancelAdminInvite, createDeliveryPartner, getAdminInvites, getAdminStats, getAnalytics, getDeliveryPartners, getUsers, inviteAdmin, updateDeliveryPartner, updateUserRole } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/stats", auth, admin, getAdminStats);
adminRouter.get("/analytics", auth, admin, getAnalytics);
adminRouter.get("/delivery-partners", auth, admin, getDeliveryPartners);
adminRouter.post("/delivery-partners", auth, admin, createDeliveryPartner);
adminRouter.put("/delivery-partners/:id", auth, admin, updateDeliveryPartner);
adminRouter.put("/orders/:id/assign", auth, admin, assignDeliveryPartner);
adminRouter.get("/users", auth, admin, getUsers);
adminRouter.put("/users/:id/role", auth, admin, updateUserRole);
adminRouter.post("/invites", auth, admin, inviteAdmin);
adminRouter.get("/invites", auth, admin, getAdminInvites);
adminRouter.delete("/invites/:id", auth, admin, cancelAdminInvite);
adminRouter.post("/invites/accept", auth, acceptAdminInvite);

export default adminRouter;
