import { useEffect, useState } from "react";
import type { Product } from "../../types";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import ProductCard from "../ProductCard";
import api from "../../config/api";
import toast from "react-hot-toast";
import { categoriesData } from "../../assets/assets";

const ProductSkeleton = () => (
    <div className="bg-white rounded-[32px] overflow-hidden border border-app-border-light h-[380px]">
        <div className="h-48 animate-shimmer" />
        <div className="p-6 space-y-4">
            <div className="h-4 w-3/4 mx-auto rounded-lg animate-shimmer" />
            <div className="h-3 w-1/2 mx-auto rounded-lg animate-shimmer" />
            <div className="h-10 w-full rounded-xl animate-shimmer mt-4" />
        </div>
    </div>
);

const PopularProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        setLoading(true);
        const endpoint = activeCategory === "all" ? "/products?sort=rating" : `/products?category=${activeCategory}`;
        api.get(endpoint)
            .then(({ data }) => setProducts(data.products))
            .catch((error: any) => toast.error(error.response?.data?.message || error?.message))
            .finally(() => setLoading(false));
    }, [activeCategory]);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-app-text tracking-tighter">Popular Products</h2>
                <Link to="/products" className="group flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 bg-app-text text-white rounded-full text-xs sm:text-sm font-bold hover:bg-app-green transition-all shadow-lg shrink-0">
                    Show All
                    <div className="size-5 sm:size-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRightIcon className="size-3" />
                    </div>
                </Link>
            </div>

            {/* Category Chips */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
                <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${activeCategory === "all" ? "bg-app-green-dark text-white border-app-green-dark shadow-md" : "bg-white text-app-text-light border-app-border-light hover:border-app-green-vibrant"}`}
                >
                    All Items
                </button>
                {categoriesData.slice(0, 6).map((cat) => (
                    <button
                        key={cat.slug}
                        onClick={() => setActiveCategory(cat.slug)}
                        className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${activeCategory === cat.slug ? "bg-app-green-dark text-white border-app-green-dark shadow-md" : "bg-white text-app-text-light border-app-border-light hover:border-app-green-vibrant"}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                {loading
                    ? Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
                    : products.slice(0, 10).map((product) => <ProductCard key={product.id} product={product} />)
                }
            </div>
        </section>
    );
};

export default PopularProducts;
