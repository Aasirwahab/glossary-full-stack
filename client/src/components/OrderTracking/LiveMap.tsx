import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { MapPinIcon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

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

const libraries: "places"[] = ["places"];

export default function LiveMap({ order, liveLocation }: { order: any; liveLocation: any }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY || import.meta.env.MAP_API_KEY || "",
        libraries
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<"delivery" | "destination" | null>(null);

    // Determine vehicle type from the delivery partner
    const vehicleType: string = order?.deliveryPartner?.vehicleType || "bike";
    const vehicleSvg = vehicleSvgMap[vehicleType] || bikeSvg;

    const vehicleIcon = useMemo(() => ({
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(vehicleSvg),
        scaledSize: isLoaded ? new window.google.maps.Size(48, 48) : undefined,
        anchor: isLoaded ? new window.google.maps.Point(24, 24) : undefined,
    }), [vehicleSvg, isLoaded]);

    const destinationIcon = useMemo(() => ({
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(destinationMarkerSvg),
        scaledSize: isLoaded ? new window.google.maps.Size(40, 52) : undefined,
        anchor: isLoaded ? new window.google.maps.Point(20, 52) : undefined,
    }), [isLoaded]);

    const onLoad = (map: google.maps.Map) => {
        setMap(map);
    };

    const onUnmount = () => {
        setMap(null);
    };

    useEffect(() => {
        if (map && liveLocation && liveLocation.lat !== 0) {
            map.panTo({ lat: liveLocation.lat, lng: liveLocation.lng });
        }
    }, [liveLocation, map]);

    const vehicleLabel = vehicleType === "bike" ? "Bike" : vehicleType === "scooter" ? "Scooter" : vehicleType === "car" ? "Car" : "Vehicle";

    if (!isLoaded) return (
        <div className="h-full bg-slate-50 flex-center">
            <div className="text-center">
                <div className="size-12 bg-white rounded-full shadow-sm flex-center mx-auto mb-3 border border-app-border">
                    <MapPinIcon className="size-6 text-app-green animate-pulse" />
                </div>
                <p className="text-sm text-slate-500 font-medium">Loading Google Maps...</p>
            </div>
        </div>
    );

    return (
        <>
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <div className="live-map-container rounded-2xl overflow-hidden border border-app-border shadow-sm group relative h-full w-full">
                    {liveLocation && liveLocation.lat !== 0 ? (
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={{ lat: liveLocation.lat, lng: liveLocation.lng }}
                            zoom={15}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{ disableDefaultUI: true, zoomControl: true }}
                        >
                            <Marker
                                position={{ lat: liveLocation.lat, lng: liveLocation.lng }}
                                icon={vehicleIcon}
                                onClick={() => setSelectedMarker("delivery")}
                            >
                                {selectedMarker === "delivery" && (
                                    <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                                        <div className="p-1">
                                            <span className="flex items-center gap-1.5 font-medium text-sm">
                                                🚚 {order?.deliveryPartner?.name || "Delivery Partner"} • {vehicleLabel}
                                            </span>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Marker>
                            
                            {order.shippingAddress.lat && order.shippingAddress.lng && (
                                <Marker
                                    position={{ lat: order.shippingAddress.lat, lng: order.shippingAddress.lng }}
                                    icon={destinationIcon}
                                    onClick={() => setSelectedMarker("destination")}
                                >
                                    {selectedMarker === "destination" && (
                                        <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                                            <div className="font-medium text-sm p-1">Delivery Address</div>
                                        </InfoWindow>
                                    )}
                                </Marker>
                            )}
                        </GoogleMap>
                    ) : order.shippingAddress.lat && order.shippingAddress.lng ? (
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={{ lat: order.shippingAddress.lat, lng: order.shippingAddress.lng }}
                            zoom={15}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{ disableDefaultUI: true, zoomControl: true }}
                        >
                            <Marker
                                position={{ lat: order.shippingAddress.lat, lng: order.shippingAddress.lng }}
                                icon={destinationIcon}
                                onClick={() => setSelectedMarker("destination")}
                            >
                                {selectedMarker === "destination" && (
                                    <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                                        <div className="font-medium text-sm p-1">Delivery Address</div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        </GoogleMap>
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
