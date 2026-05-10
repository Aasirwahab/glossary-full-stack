import { CalendarIcon, CheckIcon, ClockIcon, TruckIcon } from "lucide-react";
import type { Address } from "../../types";

const DELIVERY_SLOTS = [
    { value: "9AM - 12PM", label: "Morning (9AM - 12PM)" },
    { value: "12PM - 3PM", label: "Afternoon (12PM - 3PM)" },
    { value: "3PM - 6PM", label: "Evening (3PM - 6PM)" },
    { value: "6PM - 9PM", label: "Night (6PM - 9PM)" },
];

function getNextDays(count: number): { value: string; label: string }[] {
    const days: { value: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const value = d.toISOString().split("T")[0];
        const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        days.push({ value, label });
    }
    return days;
}

interface CheckoutReviewProps {
    address: Address;
    items: any[];
    handlePlaceOrder: () => void;
    loading: boolean;
    total: number;
    deliveryDate: string;
    setDeliveryDate: (date: string) => void;
    deliverySlot: string;
    setDeliverySlot: (slot: string) => void;
}

export default function CheckoutReview({ address, items, handlePlaceOrder, loading, total, deliveryDate, setDeliveryDate, deliverySlot, setDeliverySlot }: CheckoutReviewProps) {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const deliveryDays = getNextDays(5);

    return (
        <div className="bg-white rounded-2xl p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-app-green mb-5 flex items-center gap-2">
                <CheckIcon className="size-5" /> Review Your Order
            </h2>

            {/* Delivery Info */}
            <div className="mb-5 p-4 bg-app-cream rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <TruckIcon className="size-4 text-app-green" />
                    <span className="text-sm font-semibold text-app-green">Delivery Address</span>
                </div>
                <p className="text-sm text-app-text-light">
                    {address.label} — {address.address}, {address.city}, {address.state} {address.zip}
                </p>
            </div>

            {/* Delivery Schedule */}
            <div className="mb-5 p-4 bg-app-cream rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="size-4 text-app-green" />
                    <span className="text-sm font-semibold text-app-green">Delivery Schedule</span>
                    <span className="text-xs text-app-text-light">(optional)</span>
                </div>

                {/* Date Selection */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                    {deliveryDays.map((day) => (
                        <button
                            key={day.value}
                            type="button"
                            onClick={() => setDeliveryDate(deliveryDate === day.value ? "" : day.value)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${deliveryDate === day.value ? "bg-app-green text-white" : "bg-white text-app-text-light hover:bg-green-50"}`}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>

                {/* Time Slot Selection */}
                {deliveryDate && (
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <ClockIcon className="size-3.5 text-app-text-light" />
                            <span className="text-xs text-app-text-light">Select a time slot</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {DELIVERY_SLOTS.map((slot) => (
                                <button
                                    key={slot.value}
                                    type="button"
                                    onClick={() => setDeliverySlot(deliverySlot === slot.value ? "" : slot.value)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${deliverySlot === slot.value ? "bg-app-green text-white" : "bg-white text-app-text-light hover:bg-green-50"}`}
                                >
                                    {slot.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!deliveryDate && <p className="text-xs text-app-text-light">Leave empty for standard delivery</p>}
            </div>

            {/* Items */}
            <div className="space-y-3 mb-5">
                {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.name} className="size-12 rounded-lg object-cover" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-app-green">{item.product.name}</p>
                            <p className="text-xs text-app-text-light">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold">
                            {currency}
                            {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <button onClick={handlePlaceOrder} disabled={loading} className="w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors disabled:opacity-60 active:scale-[0.98]">
                {loading ? "Placing Order..." : `Place Order — ${currency}${total.toFixed(2)}`}
            </button>
        </div>
    );
}
