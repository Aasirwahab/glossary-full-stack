import { useEffect, useState } from "react";
import { HeartIcon, Loader2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import api from "../config/api";

const Wishlist = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/wishlist")
            .then(({ data }) => setProducts(data.wishlist))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-app-cream pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-app-text mb-8">{t("wishlist.title")}</h1>

                {loading ? (
                    <div className="flex-center py-20">
                        <Loader2Icon className="size-7 animate-spin text-app-green" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="size-20 rounded-3xl bg-zinc-50 flex-center mx-auto mb-5">
                            <HeartIcon className="size-9 text-zinc-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-app-text mb-2">{t("wishlist.empty")}</h2>
                        <p className="text-sm text-app-text-lighter mb-6">{t("wishlist.saveForLater")}</p>
                        <Link to="/products" className="px-6 py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-all">
                            {t("wishlist.browseProducts")}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
