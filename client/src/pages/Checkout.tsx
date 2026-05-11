import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Address } from "../types";
import { ArrowLeft, CheckIcon, CreditCardIcon, MapPinIcon, ShoppingBagIcon, SparklesIcon } from "lucide-react";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import api from "../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Checkout = () => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [step, setStep] = useState("address");
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState<Address>({
        id: "",
        label: "Home",
        address: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false,
        lat: 0,
        lng: 0,
    });

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliverySlot, setDeliverySlot] = useState("");

    const deliveryFee = cartTotal > 20 ? 0 : 1.99;
    const tax = cartTotal * 0.08;
    const total = cartTotal + deliveryFee + tax;

    const steps: { key: string; label: string; icon: typeof MapPinIcon }[] = [
        { key: "address", label: "Address", icon: MapPinIcon },
        { key: "payment", label: "Payment", icon: CreditCardIcon },
        { key: "review", label: "Review", icon: CheckIcon },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === step);

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                items: items.map((item) => ({
                    product: item.product.id,
                    quantity: item.quantity,
                })),
                shippingAddress: address,
                paymentMethod,
                deliveryDate: deliveryDate || undefined,
                deliverySlot: deliverySlot || undefined,
            };

            const { data } = await api.post("/orders", orderData);
            console.log(data);

            if (data.url) {
                window.location.href = data.url;
                return;
            }
            clearCart();
            toast.success("Order placed successfully!");
            navigate(`/orders/${data.order.id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
            scrollTo(0, 0);
        }
    };

    useState(() => {
        if (user?.addresses?.length) {
            const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
            setAddress({
                id: defaultAddr?.id,
                label: defaultAddr?.label,
                address: defaultAddr?.address,
                city: defaultAddr?.city,
                state: defaultAddr?.state,
                zip: defaultAddr?.zip,
                isDefault: defaultAddr?.isDefault,
                lat: defaultAddr?.lat,
                lng: defaultAddr?.lng,
            });
        }
    });

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-app-cream flex-center pb-24 md:pb-0">
                <div className="text-center">
                    <div className="size-20 rounded-3xl bg-zinc-50 flex-center mx-auto mb-5">
                        <ShoppingBagIcon className="size-9 text-zinc-300" />
                    </div>
                    <h2 className="text-xl font-semibold text-app-text mb-2">Your cart is empty</h2>
                    <p className="text-sm text-app-text-lighter mb-6">Add some products to checkout</p>
                    <button onClick={() => navigate("/products")} className="px-6 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-all">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app-cream pb-24 md:pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-app-text-lighter hover:text-app-green mb-6 transition-colors">
                    <ArrowLeft className="size-4" /> Back
                </button>

                <h1 className="text-2xl sm:text-3xl font-semibold text-app-text mb-8">Checkout</h1>

                {/* Steps */}
                <div className="flex items-center gap-0 mb-10 bg-white rounded-2xl p-2 shadow-soft border border-app-border/30">
                    {steps.map((s, i) => (
                        <button
                            key={s.key}
                            onClick={() => setStep(s.key)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                step === s.key
                                    ? "bg-app-green text-white shadow-sm"
                                    : i < currentStepIndex
                                      ? "text-emerald-600"
                                      : "text-app-text-lighter"
                            }`}
                        >
                            <div className={`size-6 rounded-full flex-center text-xs font-bold ${
                                step === s.key ? "bg-white/20" : i < currentStepIndex ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-400"
                            }`}>
                                {i < currentStepIndex ? <CheckIcon className="size-3.5" /> : i + 1}
                            </div>
                            <span className="hidden sm:inline">{s.label}</span>
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2">
                        {step === "address" && <CheckoutAddress address={address} setAddress={setAddress} setStep={setStep} user={user} />}
                        {step === "payment" && <CheckoutPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setStep={setStep} />}
                        {step === "review" && <CheckoutReview address={address} items={items} handlePlaceOrder={handlePlaceOrder} loading={loading} total={total} deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate} deliverySlot={deliverySlot} setDeliverySlot={setDeliverySlot} />}
                    </motion.div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl p-6 h-fit sticky top-24 shadow-soft border border-app-border/30">
                        <h3 className="text-sm font-semibold text-app-text mb-5">Order Summary</h3>

                        <div className="space-y-3 text-sm">
                            {items.slice(0, 3).map((item) => (
                                <div key={item.product.id} className="flex items-center gap-3">
                                    <img src={item.product.image} alt="" className="size-10 rounded-lg object-cover bg-zinc-50 p-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs truncate text-zinc-600">{item.product.name}</p>
                                        <p className="text-xs text-zinc-400">x{item.quantity}</p>
                                    </div>
                                    <span className="text-xs font-medium">{currency}{(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            {items.length > 3 && <p className="text-xs text-app-text-lighter text-center">+{items.length - 3} more items</p>}
                        </div>

                        <div className="border-t border-app-border/30 mt-4 pt-4 space-y-2.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-app-text-light">Subtotal</span>
                                <span className="font-medium">{currency}{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-app-text-light">Delivery</span>
                                <span className="font-medium">{deliveryFee === 0 ? <span className="text-emerald-600">Free</span> : `${currency}${deliveryFee.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-app-text-light">Tax</span>
                                <span className="font-medium">{currency}{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-app-border/30 text-base font-bold">
                                <span>Total</span>
                                <span className="text-app-green">{currency}{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {deliveryFee === 0 && (
                            <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl text-xs text-emerald-600 font-medium">
                                <SparklesIcon className="size-3.5 shrink-0" /> You're saving on delivery!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
