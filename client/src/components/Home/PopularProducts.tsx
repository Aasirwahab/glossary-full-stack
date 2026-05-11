import { useEffect, useState } from "react";
import type { Product } from "../../types";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import ProductCard from "../ProductCard";
import api from "../../config/api";
import toast from "react-hot-toast";

const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
        <div className="aspect-square animate-shimmer" />
        <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 rounded-lg animate-shimmer" />
            <div className="h-3 w-1/2 rounded-lg animate-shimmer" />
            <div className="flex justify-between items-center pt-1">
                <div className="h-5 w-16 rounded-lg animate-shimmer" />
                <div className="size-8 rounded-full animate-shimmer" />
            </div>
        </div>
    </div>
);

const PopularProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/products?sort=rating")
            .then(({ data }) => setProducts(data.products))
            .catch((error: any) => toast.error(error.response?.data?.message || error?.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="pb-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-app-text">Popular Products</h2>
                        <p className="text-sm text-app-text-light mt-1.5">Top-rated products this season</p>
                    </div>
                    <Link to="/products" className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors">
                        View All <ArrowRightIcon className="size-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
                    {loading
                        ? Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
                        : products.slice(0, 10).map((product) => <ProductCard key={product.id} product={product} />)
                    }
                </div>
            </div>
        </section>
    );
};

export default PopularProducts;
