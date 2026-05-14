import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MapPinIcon } from "lucide-react";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";

// --- SVG Marker Builders ---

// Bike icon (motorcycle/scooter silhouette)
const bikeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="#2d5a27" stroke="#fff" stroke-width="3" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"/>
  <g transform="translate(10, 12)" fill="#fff">
    <circle cx="6" cy="18" r="4" fill="none" stroke="#fff" stroke-width="2"/>
    <circle cx="22" cy="18" r="4" fill="none" stroke="#fff" stroke-width="2"/>
    <path d="M6 18 L12 8 L18 8 L22 18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 8 L14 4 L18 4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 8 L20 12 L22 18" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="14" cy="12" r="1.5" fill="#fff"/>
  </g>
</svg>`;

// Scooter icon
const scooterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="#2d5a27" stroke="#fff" stroke-width="3" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"/>
  <g transform="translate(10, 11)" fill="#fff">
    <circle cx="7" cy="20" r="4" fill="none" stroke="#fff" stroke-width="2"/>
    <circle cx="23" cy="20" r="4" fill="none" stroke="#fff" stroke-width="2"/>
    <path d="M7 20 L7 14 L14 10 L14 6 L18 6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 10 L20 10 L23 16 L23 20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="7" y="12" width="10" height="5" rx="1.5" fill="#fff" opacity="0.7"/>
    <rect x="13" y="4" width="6" height="3" rx="1" fill="#fff" opacity="0.9"/>
  </g>
</svg>`;

// Car icon (compact car silhouette)
const carSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="#2d5a27" stroke="#fff" stroke-width="3" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"/>
  <g transform="translate(8, 13)" fill="#fff">
    <path d="M4 14 L6 8 L12 4 L22 4 L28 8 L30 14 L30 18 L4 18 Z" fill="#fff" opacity="0.95"/>
    <rect x="8" y="6" width="6" height="5" rx="1" fill="#2d5a27" opacity="0.5"/>
    <rect x="18" y="6" width="6" height="5" rx="1" fill="#2d5a27" opacity="0.5"/>
    <circle cx="10" cy="18" r="3" fill="#2d5a27"/>
    <circle cx="10" cy="18" r="1.5" fill="#fff"/>
    <circle cx="24" cy="18" r="3" fill="#2d5a27"/>
    <circle cx="24" cy="18" r="1.5" fill="#fff"/>
  </g>
</svg>`;

// Truck icon (fallback)
const truckSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="#2d5a27" stroke="#fff" stroke-width="3" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"/>
  <g transform="translate(10, 12)" fill="#fff">
    <rect x="1" y="6" width="16" height="12" rx="1.5" fill="#fff"/>
    <path d="M17 10 L22 10 L26 15 L26 18 L17 18 Z" fill="#fff" opacity="0.9"/>
    <rect x="3" y="8" width="5" height="4" rx="0.5" fill="#2d5a27" opacity="0.3"/>
    <rect x="19" y="11" width="4" height="3" rx="0.5" fill="#2d5a27" opacity="0.3"/>
    <circle cx="7" cy="18" r="3" fill="#2d5a27"/>
    <circle cx="7" cy="18" r="1.5" fill="#fff"/>
    <circle cx="22" cy="18" r="3" fill="#2d5a27"/>
    <circle cx="22" cy="18" r="1.5" fill="#fff"/>
  </g>
</svg>`;

const vehicleSvgMap: Record<string, string> = {
    bike: bikeSvg,
    scooter: scooterSvg,
    car: carSvg,
    truck: truckSvg,
};

// Professional SVG destination pin (orange gradient drop pin)
const destinationMarkerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
  <defs>
    <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f97316"/>
      <stop offset="100%" style="stop-color:#ea580c"/>
    </linearGradient>
    <filter id="pinShadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 32 20 32s20-18 20-32C40 8.954 31.046 0 20 0z" fill="url(#pinGrad)" filter="url(#pinShadow)"/>
  <circle cx="20" cy="20" r="8" fill="#fff"/>
  <circle cx="20" cy="20" r="4" fill="#ea580c"/>
</svg>`;

// Pulsing circle around delivery partner (animated via CSS)
const pulsingMarkerHtml = `
<div class="delivery-pulse-wrapper">
  <div class="delivery-pulse-ring"></div>
  <div class="delivery-pulse-ring delivery-pulse-ring-2"></div>
  <div class="delivery-marker-dot"></div>
</div>`;

export default function LiveMap({ order, liveLocation }: { order: any; liveLocation: any }) {
    // Determine vehicle type from the delivery partner
    const vehicleType: string = order?.deliveryPartner?.vehicleType || "bike";
    const vehicleSvg = vehicleSvgMap[vehicleType] || bikeSvg;

    // Professional SVG vehicle icon (dynamic based on partner's vehicle)
    const vehicleIcon = useMemo(() => L.divIcon({
        html: vehicleSvg,
        className: "delivery-marker-icon",
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -28],
    }), [vehicleSvg]);

    // Professional SVG destination pin
    const destinationIcon = useMemo(() => L.divIcon({
        html: destinationMarkerSvg,
        className: "delivery-marker-icon",
        iconSize: [40, 52],
        iconAnchor: [20, 52],
        popupAnchor: [0, -52],
    }), []);

    // Pulsing live location indicator
    const pulsingIcon = useMemo(() => L.divIcon({
        html: pulsingMarkerHtml,
        className: "delivery-pulse-icon",
        iconSize: [80, 80],
        iconAnchor: [40, 40],
    }), []);

    // Component to re-center map when location changes
    function MapUpdater({ center }: { center: [number, number] }) {
        const map = useMap();
        useEffect(() => {
            map.setView(center, map.getZoom());
        }, [center, map]);
        return null;
    }

    // Vehicle label for popup
    const vehicleLabel = vehicleType === "bike" ? "Bike" : vehicleType === "scooter" ? "Scooter" : vehicleType === "car" ? "Car" : "Vehicle";

    return (
        <>
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <div className="live-map-container rounded-2xl overflow-hidden border border-app-border shadow-sm group relative">
                    {liveLocation && liveLocation.lat !== 0 ? (
                        <MapContainer center={[liveLocation.lat, liveLocation.lng]} zoom={15} className="live-map-inner" zoomControl={false}>
                            <TileLayer 
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                className="map-tiles-premium"
                            />
                            {/* Pulsing ring behind the vehicle */}
                            <Marker position={[liveLocation.lat, liveLocation.lng]} icon={pulsingIcon} />
                            {/* Delivery vehicle marker (bike/scooter/car) */}
                            <Marker position={[liveLocation.lat, liveLocation.lng]} icon={vehicleIcon}>
                                <Popup>
                                    <span className="flex items-center gap-1.5">
                                        🚚 {order?.deliveryPartner?.name || "Delivery Partner"} • {vehicleLabel}
                                    </span>
                                </Popup>
                            </Marker>
                            {order.shippingAddress.lat && order.shippingAddress.lng && (
                                <Marker position={[order.shippingAddress.lat, order.shippingAddress.lng]} icon={destinationIcon}>
                                    <Popup>Delivery Address</Popup>
                                </Marker>
                            )}
                            <MapUpdater center={[liveLocation.lat, liveLocation.lng]} />
                        </MapContainer>
                    ) : order.shippingAddress.lat && order.shippingAddress.lng ? (
                        <MapContainer center={[order.shippingAddress.lat, order.shippingAddress.lng]} zoom={15} className="live-map-inner" zoomControl={false}>
                            <TileLayer 
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                className="map-tiles-premium"
                            />
                            <Marker position={[order.shippingAddress.lat, order.shippingAddress.lng]} icon={destinationIcon}>
                                <Popup>Delivery Address</Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <div className="h-full bg-slate-50 flex-center">
                            <div className="text-center">
                                <div className="size-12 bg-white rounded-full shadow-sm flex-center mx-auto mb-3 border border-app-border">
                                    <MapPinIcon className="size-6 text-app-green animate-pulse" />
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Waiting for delivery partner location...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
