import express from "express";
import { createProduct, deleteProduct, getFlashDeals, getProduct, getProducts, getProductsByIds, updateProduct } from "../controllers/productController.js";
import { createReview, deleteReview, getReviews } from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const productRouter = express.Router();

productRouter.get("/flash-deals", getFlashDeals);
productRouter.post("/batch", getProductsByIds);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/", auth, admin, createProduct);
productRouter.put("/:id", auth, admin, updateProduct);
productRouter.delete("/:id", auth, admin, deleteProduct);

// Reviews
productRouter.get("/:id/reviews", getReviews);
productRouter.post("/:id/reviews", auth, createReview);
productRouter.delete("/:id/reviews/:reviewId", auth, deleteReview);

export default productRouter;
