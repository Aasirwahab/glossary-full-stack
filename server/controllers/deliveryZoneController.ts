import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Haversine distance in km
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/delivery-zones — list all zones (admin)
export const getDeliveryZones = async (req: Request, res: Response) => {
    const zones = await prisma.deliveryZone.findMany({ orderBy: { name: "asc" } });
    res.json({ zones });
};

// POST /api/delivery-zones — create zone (admin)
export const createDeliveryZone = async (req: Request, res: Response) => {
    const { name, lat, lng, radiusKm } = req.body;

    if (!name || lat == null || lng == null) {
        return res.status(400).json({ message: "Name, lat, and lng are required" });
    }

    const zone = await prisma.deliveryZone.create({
        data: { name, lat, lng, radiusKm: radiusKm || 10 },
    });

    res.status(201).json({ zone });
};

// PUT /api/delivery-zones/:id — update zone (admin)
export const updateDeliveryZone = async (req: Request, res: Response) => {
    const { name, lat, lng, radiusKm, isActive } = req.body;
    const data: any = {};
    if (name) data.name = name;
    if (lat != null) data.lat = lat;
    if (lng != null) data.lng = lng;
    if (radiusKm != null) data.radiusKm = radiusKm;
    if (isActive != null) data.isActive = isActive;

    try {
        const zone = await prisma.deliveryZone.update({
            where: { id: req.params.id as string },
            data,
        });
        res.json({ zone });
    } catch {
        res.status(404).json({ message: "Zone not found" });
    }
};

// DELETE /api/delivery-zones/:id (admin)
export const deleteDeliveryZone = async (req: Request, res: Response) => {
    try {
        await prisma.deliveryZone.delete({ where: { id: req.params.id as string } });
        res.json({ message: "Zone deleted" });
    } catch {
        res.status(404).json({ message: "Zone not found" });
    }
};

// POST /api/delivery-zones/check — check if coordinates are in a delivery zone (public)
export const checkDeliveryZone = async (req: Request, res: Response) => {
    const { lat, lng } = req.body;

    if (lat == null || lng == null) {
        return res.status(400).json({ message: "lat and lng are required" });
    }

    const zones = await prisma.deliveryZone.findMany({ where: { isActive: true } });

    // If no zones configured, allow all deliveries
    if (zones.length === 0) {
        return res.json({ deliverable: true, zone: null });
    }

    for (const zone of zones) {
        const distance = haversineKm(lat, lng, zone.lat, zone.lng);
        if (distance <= zone.radiusKm) {
            return res.json({ deliverable: true, zone: { name: zone.name, distance: Math.round(distance * 10) / 10 } });
        }
    }

    res.json({ deliverable: false, zone: null });
};
