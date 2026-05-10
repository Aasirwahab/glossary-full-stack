import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

// Analytics dashboard data
export const getAnalytics = async (req: Request, res: Response) => {
    const paidFilter = { NOT: [{ paymentMethod: "card" as const, isPaid: false }] };

    // 1) Revenue totals
    const revenueAgg = await prisma.order.aggregate({
        where: paidFilter,
        _sum: { total: true },
        _count: true,
    });
    const totalRevenue = revenueAgg._sum.total || 0;
    const totalOrders = revenueAgg._count;

    // 2) Daily revenue for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentOrders = await prisma.order.findMany({
        where: { ...paidFilter, createdAt: { gte: sevenDaysAgo } },
        select: { total: true, createdAt: true },
    });

    // Build day map
    const dailyMap: Record<string, { revenue: number; orders: number }> = {};
    for (let d = 0; d < 7; d++) {
        const date = new Date(sevenDaysAgo);
        date.setDate(date.getDate() + d);
        const key = date.toISOString().slice(0, 10);
        dailyMap[key] = { revenue: 0, orders: 0 };
    }
    for (const order of recentOrders) {
        const key = new Date(order.createdAt).toISOString().slice(0, 10);
        if (dailyMap[key]) {
            dailyMap[key].revenue += order.total;
            dailyMap[key].orders += 1;
        }
    }
    const dailyRevenue = Object.entries(dailyMap).map(([date, data]) => ({
        date,
        label: new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        ...data,
    }));

    // 3) Order status breakdown
    const allOrders = await prisma.order.findMany({
        where: paidFilter,
        select: { status: true },
    });
    const statusBreakdown: Record<string, number> = {};
    for (const o of allOrders) {
        statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1;
    }

    // 4) Top 5 selling products (from order items JSON)
    const deliveredOrders = await prisma.order.findMany({
        where: { ...paidFilter, status: "Delivered" },
        select: { items: true },
    });
    const productSales: Record<string, { name: string; image: string; sold: number; revenue: number }> = {};
    for (const order of deliveredOrders) {
        const items = order.items as any[];
        for (const item of items) {
            if (!productSales[item.product]) {
                productSales[item.product] = { name: item.name, image: item.image, sold: 0, revenue: 0 };
            }
            productSales[item.product].sold += item.quantity;
            productSales[item.product].revenue += item.price * item.quantity;
        }
    }
    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1].sold - a[1].sold)
        .slice(0, 5)
        .map(([id, data]) => ({ id, ...data }));

    // 5) Category breakdown
    const products = await prisma.product.findMany({ select: { category: true } });
    const categoryCount: Record<string, number> = {};
    for (const p of products) {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    }
    const categories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

    // 6) New users this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await prisma.user.count({ where: { createdAt: { gte: monthStart } } });

    res.json({
        totalRevenue,
        totalOrders,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        newUsersThisMonth,
        dailyRevenue,
        statusBreakdown,
        topProducts,
        categories,
    });
};

// get admin dashboard data
export const getAdminStats = async (req: Request, res: Response) => {
    const [totalOrders, totalUsers, totalProducts, outOfStock, totalPartners, recentOrders] = await Promise.all([
        prisma.order.count({ where: { NOT: [{ paymentMethod: "card", isPaid: false }] } }),
        prisma.user.count(),
        prisma.product.count(),
        prisma.product.count({ where: { stock: 0 } }),
        prisma.deliveryPartner.count(),
        prisma.order.findMany({
            where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
            orderBy: { createdAt: "desc" },
            take: 8,
            include: {
                user: { select: { name: true, email: true } },
                deliveryPartner: { select: { name: true, phone: true } },
            },
        }),
    ]);
    const totalAdmins = await prisma.user.count({ where: { role: "admin" } });
    res.json({ totalOrders, totalUsers, totalProducts, outOfStock, totalPartners, totalAdmins, recentOrders });
};

// get delivery partners list for admin
export const getDeliveryPartners = async (req: Request, res: Response) => {
    const partners = await prisma.deliveryPartner.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ partners });
};

// create delivery partner profile
export const createDeliveryPartner = async (req: Request, res: Response) => {
    const { name, email, password, phone, vehicleType } = req.body;

    if (!name || !email || !password || !phone) {
        res.status(400).json({ message: "Please provide all required fields" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = await prisma.deliveryPartner.create({
        data: { name, email: email.toLowerCase(), password: hashedPassword, phone, vehicleType },
    });

    res.status(201).json({ partner });
};

// update delivery partner profile
export const updateDeliveryPartner = async (req: Request, res: Response) => {
    const { name, phone, vehicleType, isActive } = req.body;
    const data: any = {};
    if (name) data.name = name;
    if (phone) data.phone = phone;
    if (vehicleType) data.vehicleType = vehicleType;
    data.isActive = isActive;

    try {
        const partner = await prisma.deliveryPartner.update({
            where: { id: req.params.id as string },
            data,
        });
        res.json({ partner });
    } catch (error) {
        res.status(404).json({ message: "Partner not found" });
    }
};

// assign delivery partner for order
export const assignDeliveryPartner = async (req: Request, res: Response) => {
    const { partnerId } = req.body;

    const order = await prisma.order.findUnique({
        where: { id: req.params.id as string },
    });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const partner = await prisma.deliveryPartner.findUnique({
        where: { id: partnerId },
    });

    if (!partner) {
        return res.status(404).json({ message: "Delivery partner not found" });
    }

    const otp = String(crypto.randomInt(100000, 999999));

    let status = order.status;

    const history: any[] = Array.isArray(order.statusHistory) ? order.statusHistory : [];

    if (order.status === "Placed" || order.status === "Confirmed") {
        status = "Assigned";
        history.push({
            status: "Assigned",
            note: `Assigned to ${partner.name}`,
            timestamp: new Date(),
        });
    }

    await prisma.order.update({
        where: { id: order.id },
        data: { deliveryPartnerId: partner.id, deliveryOtp: otp, status, statusHistory: history },
    });

    res.json({ order });
};

// Get all users (admin)
export const getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isVerified: true,
            createdAt: true,
            _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    res.json({ users });
};

// Update user role (admin)
export const updateUserRole = async (req: Request, res: Response) => {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" });
    }

    // Prevent removing the last admin
    if (role === "user") {
        const adminCount = await prisma.user.count({ where: { role: "admin" } });
        const targetUser = await prisma.user.findUnique({ where: { id: req.params.id as string } });
        if (adminCount <= 1 && targetUser?.role === "admin") {
            return res.status(400).json({ message: "Cannot remove the last admin" });
        }
    }

    const user = await prisma.user.update({
        where: { id: req.params.id as string },
        data: { role },
        select: { id: true, name: true, email: true, role: true, isVerified: true },
    });

    res.json({ user });
};
