import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { getCache, setCache, clearCache } from "../config/cache.js";

// GET /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
    const cacheKey = "flash-deals";
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const products = await prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { originalPrice: "desc" },
        take: 8,
    });

    const productsWithDiscount = products.map((p: any) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return { ...p, discount };
    });

    const result = { products: productsWithDiscount };
    setCache(cacheKey, result, 120); // Cache 2 minutes
    res.json(result);
};

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    const cacheKey = `products:${category || "all"}:${search || ""}:${minPrice || ""}:${maxPrice || ""}:${sort || ""}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const where: any = {};
    if (category && category !== "all") where.category = category as string;
    if (search) where.name = { contains: search as string, mode: "insensitive" };
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const orderBy: any = {};
    if (sort === "price-low") orderBy.price = "asc";
    else if (sort === "price-high") orderBy.price = "desc";
    else orderBy.createdAt = "desc";

    const products = await prisma.product.findMany({ where, orderBy });

    const productsWithDiscount = products.map((p: any) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return { ...p, discount };
    });

    const result = { products: productsWithDiscount };
    setCache(cacheKey, result, 60); // Cache 1 minute
    res.json(result);
};

// GET /api/products/:id

export const getProduct = async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });

    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    res.json({ product: { ...product, discount } });
};

// POST /api/products/batch — get multiple products by IDs (for reorder)
export const getProductsByIds = async (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Product IDs array is required" });
    }

    const products = await prisma.product.findMany({
        where: { id: { in: ids.slice(0, 50) } },
    });

    const productsWithDiscount = products.map((p: any) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return { ...p, discount };
    });

    res.json({ products: productsWithDiscount });
};

// POST /api/products
export const createProduct = async (req: Request, res: Response) => {
    const product = await prisma.product.create({ data: req.body });
    clearCache("products");
    clearCache("flash-deals");
    res.status(201).json({ product });
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
    const product = await prisma.product.update({ where: { id: req.params.id as string }, data: req.body });
    clearCache("products");
    clearCache("flash-deals");
    res.json({ product });
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
    await prisma.product.update({
        where: { id: req.params.id as string },
        data: { stock: Number(0) },
    });
    clearCache("products");
    clearCache("flash-deals");
    res.json({ message: "Product Updated" });
};
