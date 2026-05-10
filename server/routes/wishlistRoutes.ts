import express from "express";
import auth from "../middleware/auth.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/", auth, getWishlist);
wishlistRouter.post("/:productId", auth, addToWishlist);
wishlistRouter.delete("/:productId", auth, removeFromWishlist);

export default wishlistRouter;
