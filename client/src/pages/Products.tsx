import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Product } from "../types";
import { categoriesData } from "../assets/assets";
import { ChevronDown, Home, PackageIcon, SlidersHorizontal, XIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import api from "../config/api";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-app-border/30">
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

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const category = searchParams.get("category") || "";
    const organic = searchParams.get("organic") || "";
    const sort = searchParams.get("sort") || "";
    const page = Number(searchParams.get("page")) || 1;
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category) params.set("category", category);
            if (organic) params.set("organic", organic);
            if (sort) params.set("sort", sort);
            if (maxPrice) params.set("maxPrice", maxPrice);
            params.set("page", String(page));
            params.set("limit", "12");

            const { data } = await api.get(`/products?${params.toString()}`);
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== "page") {
            newParams.delete("page");
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => setSearchParams({});

    const activeCategory = categoriesData.find((c) => c.slug === category);
    const hasFilters = category || organic || minPrice || maxPrice;

    useEffect(() => {
        fetchProducts();
    }, [category, organic, sort, page, minPrice, maxPrice]);

    return (
        <div className="min-h-screen bg-app-cream pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-app-text-lighter mb-6">
                    <Link to="/" className="hover:text-app-green transition-colors">
                        <Home className="size-4" />
                    </Link>
                    <span className="text-app-border">/</span>
                    <span className="text-app-text font-medium">{activeCategory ? activeCategory.name : "All Products"}</span>
                </nav>

                <div className="flex gap-8 xl:gap-10">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="bg-white rounded-2xl p-5 sticky top-24 shadow-soft border border-app-border/30">
                            <FilterPanel categories={categoriesData} category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} updateFilter={updateFilter} clearFilters={clearFilters} hasFilters={hasFilters} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-semibold text-app-text">{activeCategory ? activeCategory.name : "All Products"}</h1>
                                <p className="text-sm text-app-text-lighter mt-1">{products.length} products found</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm bg-white rounded-xl border border-app-border/50 hover:border-app-border shadow-soft transition-all">
                                    <SlidersHorizontal className="size-4 text-zinc-500" /> Filters
                                </button>

                                <div className="relative">
                                    <select value={sort} onChange={(e) => updateFilter("sort", e.target.value)} className="appearance-none pl-4 pr-9 py-2.5 text-sm bg-white rounded-xl border border-app-border/50 focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] outline-none cursor-pointer shadow-soft transition-all">
                                        <option value="">Newest</option>
                                        <option value="price_asc">Price: Low → High</option>
                                        <option value="price_desc">Price: High → Low</option>
                                        <option value="rating">Top Rated</option>
                                        <option value="name">A → Z</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6">
                                {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="size-20 rounded-3xl bg-zinc-50 flex-center mx-auto mb-5">
                                    <PackageIcon className="size-9 text-zinc-300" />
                                </div>
                                <p className="text-lg font-semibold text-app-text mb-2">No products found</p>
                                <p className="text-sm text-app-text-lighter mb-6">Try adjusting your filters or search terms</p>
                                <button onClick={clearFilters} className="px-6 py-2.5 text-sm font-medium bg-app-green text-white rounded-xl hover:bg-app-green-light transition-all">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6">
                                {products.map((product) => product.stock > 0 && <ProductCard key={product.id} product={product} />)}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex-center gap-2 mt-12">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            updateFilter("page", String(i + 1));
                                            scrollTo(0, 0);
                                        }}
                                        className={`size-10 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? "bg-app-green text-white shadow-sm" : "bg-white text-app-text-light hover:bg-zinc-50 border border-app-border/50"}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
                {mobileFiltersOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50" onClick={() => setMobileFiltersOpen(false)} />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-app-border/50">
                                <h3 className="text-lg font-semibold text-app-text">Filters</h3>
                                <button onClick={() => setMobileFiltersOpen(false)} className="size-10 rounded-xl hover:bg-zinc-50 flex-center transition-colors">
                                    <XIcon className="size-5 text-zinc-400" />
                                </button>
                            </div>
                            <div className="p-6">
                                <FilterPanel categories={categoriesData} category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} updateFilter={updateFilter} clearFilters={clearFilters} hasFilters={hasFilters} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;
