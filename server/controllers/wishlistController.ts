import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Get user's wishlist
// GET /api/wishlist
export const getWishlist = async (req: Request, res: Response) => {
    const items = await prisma.wishlist.findMany({
        where: { userId: req.user!.id },
        include: { product: true },
        orderBy: { createdAt: "desc" },
    });

    res.json({ wishlist: items.map((item) => item.product) });
};

// Add product to wishlist
// POST /api/wishlist/:productId
export const addToWishlist = async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const userId = req.user!.id;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // Upsert — idempotent, no error if already exists
    await prisma.wishlist.upsert({
        where: { userId_productId: { userId, productId } },
        create: { userId, productId },
        update: {},
    });

    res.json({ message: "Added to wishlist" });
};

// Remove product from wishlist
// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const userId = req.user!.id;

    await prisma.wishlist.deleteMany({
        where: { userId, productId },
    });

    res.json({ message: "Removed from wishlist" });
};
