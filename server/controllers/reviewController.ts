import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Helper: recalculate product rating and reviewCount
const updateProductRating = async (productId: string) => {
    const stats = await prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: true,
    });

    await prisma.product.update({
        where: { id: productId },
        data: {
            rating: Math.round((stats._avg.rating || 0) * 10) / 10,
            reviewCount: stats._count,
        },
    });
};

// Get reviews for a product
// GET /api/products/:id/reviews
export const getReviews = async (req: Request, res: Response) => {
    const reviews = await prisma.review.findMany({
        where: { productId: req.params.id as string },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
    });

    res.json({ reviews });
};

// Submit a review (one per user per product, must have purchased)
// POST /api/products/:id/reviews
export const createReview = async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const userId = req.user!.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has purchased this product (delivered orders only)
    const orders = await prisma.order.findMany({
        where: { userId, status: "Delivered" },
        select: { items: true },
    });

    const hasPurchased = orders.some((order) => {
        const items = order.items as any[];
        return items.some((item) => item.product === productId);
    });

    if (!hasPurchased) {
        return res.status(403).json({ message: "You can only review products you have purchased" });
    }

    // Check if already reviewed
    const existing = await prisma.review.findUnique({
        where: { userId_productId: { userId, productId } },
    });

    if (existing) {
        return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await prisma.review.create({
        data: {
            userId,
            productId,
            rating: Math.round(rating),
            comment: comment?.trim() || "",
        },
        include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    await updateProductRating(productId);

    res.status(201).json({ review });
};

// Delete own review
// DELETE /api/products/:id/reviews/:reviewId
export const deleteReview = async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const reviewId = req.params.reviewId as string;
    const userId = req.user!.id;

    const review = await prisma.review.findFirst({
        where: { id: reviewId, productId, userId },
    });

    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    await updateProductRating(productId);

    res.json({ message: "Review deleted" });
};
