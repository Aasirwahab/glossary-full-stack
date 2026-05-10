import { useEffect, useState } from "react";
import { Loader2Icon, MapPinIcon, PlusIcon, Trash2Icon } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";

interface DeliveryZone {
    id: string;
    name: string;
    lat: number;
    lng: number;
    radiusKm: number;
    isActive: boolean;
}

export default function AdminDeliveryZones() {
    const [zones, setZones] = useState<DeliveryZone[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: "", lat: "", lng: "", radiusKm: "10" });

    const fetchZones = () => {
        api.get("/delivery-zones")
            .then(({ data }) => setZones(data.zones))
            .catch((err: any) => toast.error(err?.response?.data?.message || err?.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.lat || !form.lng) {
            toast.error("Name, latitude, and longitude are required");
            return;
        }
        setSubmitting(true);
        try {
            await api.post("/delivery-zones", {
                name: form.name,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
                radiusKm: parseFloat(form.radiusKm) || 10,
            });
            toast.success("Delivery zone created");
            setForm({ name: "", lat: "", lng: "", radiusKm: "10" });
            setShowForm(false);
            fetchZones();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (zone: DeliveryZone) => {
        try {
            await api.put(`/delivery-zones/${zone.id}`, { isActive: !zone.isActive });
            setZones((prev) => prev.map((z) => (z.id === zone.id ? { ...z, isActive: !z.isActive } : z)));
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/delivery-zones/${id}`);
            setZones((prev) => prev.filter((z) => z.id !== id));
            toast.success("Zone deleted");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    if (loading) {
        return (
            <div className="flex-center py-20">
                <Loader2Icon className="size-6 animate-spin text-app-text-light" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-app-green">Delivery Zones</h1>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors">
                    <PlusIcon className="size-4" /> Add Zone
                </button>
            </div>

            {/* Info */}
            <p className="text-sm text-app-text-light mb-6">
                Define areas where delivery is available. If no zones are configured, delivery is allowed everywhere.
            </p>

            {/* Create Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 mb-6 border border-app-border space-y-4">
                    <h3 className="text-sm font-semibold text-app-green">New Delivery Zone</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-app-green mb-1">Zone Name</label>
                            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Downtown, City Center" className="w-full px-3 py-2 text-sm rounded-xl border not-focus:border-app-border" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-app-green mb-1">Center Latitude</label>
                            <input type="number" step="any" required value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="e.g. 40.7128" className="w-full px-3 py-2 text-sm rounded-xl border not-focus:border-app-border" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-app-green mb-1">Center Longitude</label>
                            <input type="number" step="any" required value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="e.g. -74.0060" className="w-full px-3 py-2 text-sm rounded-xl border not-focus:border-app-border" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-app-green mb-1">Radius (km)</label>
                            <input type="number" step="0.1" min="0.5" value={form.radiusKm} onChange={(e) => setForm({ ...form, radiusKm: e.target.value })} className="w-full px-3 py-2 text-sm rounded-xl border not-focus:border-app-border" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={submitting} className="px-5 py-2 bg-app-green text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2">
                            {submitting && <Loader2Icon className="size-4 animate-spin" />} Create Zone
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 text-sm text-app-text-light hover:text-app-green transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Zones List */}
            {zones.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl">
                    <MapPinIcon className="size-12 text-app-border mx-auto mb-3" />
                    <p className="text-app-text-light text-sm">No delivery zones configured</p>
                    <p className="text-xs text-app-text-light mt-1">Delivery is currently allowed everywhere</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {zones.map((zone) => (
                        <div key={zone.id} className={`bg-white rounded-2xl p-5 border transition-colors ${zone.isActive ? "border-app-border" : "border-red-200 opacity-60"}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full flex-center ${zone.isActive ? "bg-app-green/10 text-app-green" : "bg-red-50 text-red-400"}`}>
                                        <MapPinIcon className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-app-green">{zone.name}</h3>
                                        <p className="text-xs text-app-text-light">
                                            {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)} · {zone.radiusKm} km radius
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleToggle(zone)} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${zone.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                        {zone.isActive ? "Active" : "Inactive"}
                                    </button>
                                    <button onClick={() => handleDelete(zone.id)} className="text-app-text-light hover:text-red-500 transition-colors">
                                        <Trash2Icon className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
