import { useEffect, useState } from "react";
import type { Product } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { Home, SearchIcon } from "lucide-react";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import api from "../config/api";
import toast from "react-hot-toast";

const SearchResults = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        api.get(`/products?search=${encodeURIComponent(query)}`)
            .then((res) => setProducts(res.data.products))
            .catch((error: any) => {
                toast.error(error.response?.data?.message || error.message);
            })
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="min-h-screen bg-app-cream pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <nav className="flex items-center gap-2 text-sm text-app-text-lighter mb-6">
                    <Link to="/" className="hover:text-app-green transition-colors"><Home className="size-4" /></Link>
                    <span className="text-app-border">/</span>
                    <span className="text-app-text font-medium">Search Results</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-app-text mb-1">Results for "{query}"</h1>
                    <p className="text-sm text-app-text-lighter">{loading ? "Searching..." : `${products.length} items found`}</p>
                </div>

                {loading ? (
                    <Loading />
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="size-20 rounded-3xl bg-zinc-50 flex-center mx-auto mb-5">
                            <SearchIcon className="size-9 text-zinc-300" />
                        </div>
                        <h2 className="text-xl font-semibold text-app-text mb-2">No results found</h2>
                        <p className="text-sm text-app-text-lighter mb-6 max-w-md mx-auto">We couldn't find any products matching "{query}". Try a different search term.</p>
                        <Link to="/products" className="inline-flex px-6 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-all">
                            Browse All Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
