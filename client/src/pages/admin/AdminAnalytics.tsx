import { useEffect, useState } from "react";
import { DollarSignIcon, ShoppingBagIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import Loading from "../../components/Loading";
import api from "../../config/api";

interface DailyData {
    date: string;
    label: string;
    revenue: number;
    orders: number;
}

interface TopProduct {
    id: string;
    name: string;
    image: string;
    sold: number;
    revenue: number;
}

interface Analytics {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    newUsersThisMonth: number;
    dailyRevenue: DailyData[];
    statusBreakdown: Record<string, number>;
    topProducts: TopProduct[];
    categories: { name: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
    Placed: "bg-blue-100 text-blue-700",
    Confirmed: "bg-indigo-100 text-indigo-700",
    Assigned: "bg-purple-100 text-purple-700",
    "Out for Delivery": "bg-amber-100 text-amber-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
};

const BAR_COLORS = ["bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500"];

export default function AdminAnalytics() {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const [data, setData] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/analytics")
            .then((res) => setData(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;
    if (!data) return <p className="text-center py-12 text-app-text-light">Failed to load analytics</p>;

    const maxRevenue = Math.max(...data.dailyRevenue.map((d) => d.revenue), 1);

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: `${currency}${data.totalRevenue.toFixed(2)}`, icon: DollarSignIcon, color: "bg-green-50 text-green-600" },
                    { label: "Total Orders", value: data.totalOrders, icon: ShoppingBagIcon, color: "bg-blue-50 text-blue-600" },
                    { label: "Avg Order Value", value: `${currency}${data.avgOrderValue.toFixed(2)}`, icon: TrendingUpIcon, color: "bg-orange-50 text-orange-600" },
                    { label: "New Users (Month)", value: data.newUsersThisMonth, icon: UsersIcon, color: "bg-purple-50 text-purple-600" },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl p-5 border border-app-border flex justify-between gap-3">
                        <div>
                            <p className="text-xl font-semibold text-zinc-900">{card.value}</p>
                            <p className="text-xs text-app-text-light mt-1">{card.label}</p>
                        </div>
                        <div className={`size-10 rounded-xl flex-center shrink-0 ${card.color}`}>
                            <card.icon className="size-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Chart (CSS bars) */}
            <div className="bg-white rounded-2xl border border-app-border p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Revenue — Last 7 Days</h2>
                <div className="flex items-end gap-2 h-48">
                    {data.dailyRevenue.map((day, i) => {
                        const heightPct = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                        return (
                            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-medium text-zinc-600">
                                    {currency}
                                    {day.revenue.toFixed(0)}
                                </span>
                                <div className="w-full flex justify-center" style={{ height: "140px" }}>
                                    <div
                                        className={`w-full max-w-10 rounded-t-lg transition-all ${BAR_COLORS[i % BAR_COLORS.length]}`}
                                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                                        title={`${day.label}: ${currency}${day.revenue.toFixed(2)} (${day.orders} orders)`}
                                    />
                                </div>
                                <span className="text-[10px] text-zinc-500 truncate w-full text-center">{day.label.split(", ")[0]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-2xl border border-app-border p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Top Selling Products</h2>
                    {data.topProducts.length === 0 ? (
                        <p className="text-sm text-app-text-light py-4">No delivered orders yet</p>
                    ) : (
                        <div className="space-y-3">
                            {data.topProducts.map((product, i) => (
                                <div key={product.id} className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-zinc-400 w-5">{i + 1}</span>
                                    <img src={product.image} alt={product.name} className="size-10 rounded-lg object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-zinc-900 truncate">{product.name}</p>
                                        <p className="text-xs text-app-text-light">
                                            {product.sold} sold · {currency}
                                            {product.revenue.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Status + Categories */}
                <div className="space-y-6">
                    {/* Order Status Breakdown */}
                    <div className="bg-white rounded-2xl border border-app-border p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Order Status</h2>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(data.statusBreakdown).map(([status, count]) => (
                                <div key={status} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || "bg-zinc-100 text-zinc-600"}`}>
                                    {status}: {count}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-white rounded-2xl border border-app-border p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Products by Category</h2>
                        <div className="space-y-2.5">
                            {data.categories.map((cat) => {
                                const totalProducts = data.categories.reduce((sum, c) => sum + c.count, 0);
                                const pct = totalProducts > 0 ? (cat.count / totalProducts) * 100 : 0;
                                return (
                                    <div key={cat.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-700 capitalize">{cat.name}</span>
                                            <span className="text-zinc-500">{cat.count}</span>
                                        </div>
                                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-app-orange rounded-full transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
