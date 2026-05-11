import { useEffect, useState } from "react";
import type { Product } from "../types";
import { SparklesIcon, ZapIcon } from "lucide-react";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import api from "../config/api";
import toast from "react-hot-toast";

const FlashDeals = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/products/flash-deals")
            .then((res) => setProducts(res.data.products))
            .catch((error: any) => toast.error(error.response?.data?.message || error?.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-app-cream pb-24 md:pb-8">
            {/* Banner */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <div className="flex-center gap-2.5 mb-3">
                        <ZapIcon className="size-7 fill-white" />
                        <h1 className="text-3xl sm:text-4xl font-bold">Flash Deals</h1>
                        <ZapIcon className="size-7 fill-white" />
                    </div>
                    <p className="text-white/80 max-w-md mx-auto text-sm sm:text-base">Limited-time offers on your favorite organic products. Grab them before they're gone!</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <Loading />
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="size-20 rounded-3xl bg-zinc-50 flex-center mx-auto mb-5">
                            <SparklesIcon className="size-9 text-zinc-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-app-text mb-2">No deals right now</h2>
                        <p className="text-sm text-app-text-lighter">Check back soon for amazing offers!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-6">
                        {products.map((product) => product.stock > 0 && <ProductCard key={product.id} product={product} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashDeals;
