import { useEffect, useState } from "react";
import type { Order, Product } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { statusColors } from "../assets/assets";
import Loading from "../components/Loading";
import { CalendarIcon, ChevronRightIcon, PackageIcon, RefreshCwIcon } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const MyOrders = () => {
    const { t } = useTranslation();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchParams, setSearchParams] = useSearchParams();

    const tabs = ["all", "Placed", "Out for Delivery", "Delivered"];

    const { clearCart, addToCart } = useCart();
    const [reordering, setReordering] = useState<string | null>(null);

    const handleReorder = async (e: React.MouseEvent, order: Order) => {
        e.preventDefault();
        e.stopPropagation();
        setReordering(order.id);
        try {
            const productIds = order.items.map((item) => item.product);
            const { data } = await api.post("/products/batch", { ids: productIds });
            const productsMap = new Map<string, Product>(data.products.map((p: any) => [p.id, p]));

            let addedCount = 0;
            for (const item of order.items) {
                const product = productsMap.get(item.product);
                if (product && product.stock > 0) {
                    addToCart(product, item.quantity);
                    addedCount++;
                }
            }

            if (addedCount > 0) {
                toast.success(`${addedCount} item${addedCount > 1 ? "s" : ""} added to cart`);
            } else {
                toast.error("None of these items are currently in stock");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setReordering(null);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = activeTab !== "all" ? `?status=${activeTab}` : "";
            const { data } = await api.get(`/orders${params}`);
            setOrders(data.orders);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchParams.get("clearCart")) {
            clearCart();
            setSearchParams({});
            setTimeout(() => {
                fetchOrders();
            }, 2000);
        } else {
            fetchOrders();
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-app-cream pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-app-text mb-6">{t("orders.title")}</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                                activeTab === tab
                                    ? "bg-app-green text-white shadow-sm"
                                    : "bg-white text-app-text-light hover:bg-zinc-50 border border-app-border/50"
                            }`}
                        >
                            {tab === "all" ? "All Orders" : tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {loading ? (
                    <Loading />
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="size-20 rounded-3xl bg-zinc-50 flex-center mx-auto mb-5">
                            <PackageIcon className="size-9 text-zinc-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-app-text mb-2">{t("orders.noOrders")}</h2>
                        <p className="text-sm text-app-text-lighter mb-6">{t("orders.startShopping")}</p>
                        <Link to="/products" className="inline-flex px-6 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-all">
                            {t("home.shopNow")}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-4xl">
                        {orders.map((order) => (
                            <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white rounded-2xl p-5 sm:p-6 hover:shadow-elevated transition-all border border-app-border/30 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-semibold text-app-text">Order #{order.id.slice(-8).toUpperCase()}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <CalendarIcon className="size-3.5 text-app-text-lighter" />
                                            <span className="text-xs text-app-text-lighter">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>{order.status}</span>
                                        <ChevronRightIcon className="size-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                                    </div>
                                </div>

                                {/* Item thumbnails */}
                                <div className="flex items-center gap-2 mb-4">
                                    {order.items.slice(0, 4).map((item, i) => (
                                        <img key={i} src={item.image} alt={item.name} className="size-14 sm:size-16 rounded-xl object-cover bg-zinc-50 p-1 border border-app-border/30" />
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="size-14 sm:size-16 rounded-xl bg-zinc-50 flex-center text-xs font-semibold text-zinc-400 border border-app-border/30">
                                            +{order.items.length - 4}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-app-border/30 text-sm">
                                    <span className="text-app-text-lighter">{order.items.length} items</span>
                                    <div className="flex items-center gap-3">
                                        {order.status === "Delivered" && (
                                            <button
                                                onClick={(e) => handleReorder(e, order)}
                                                disabled={reordering === order.id}
                                                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-app-orange border border-app-orange/30 rounded-lg hover:bg-orange-50 transition-all disabled:opacity-50"
                                            >
                                                <RefreshCwIcon className={`size-3 ${reordering === order.id ? "animate-spin" : ""}`} />
                                                {t("orders.buyAgain")}
                                            </button>
                                        )}
                                        <span className="font-bold text-app-text">{currency}{order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
