import { XCircleIcon } from "lucide-react";

const FilterPanel = ({ categories, category, minPrice, maxPrice, updateFilter, clearFilters, hasFilters }: any) => {
    const categoriesWithAll = [{ slug: "", name: "All Categories" }, ...categories];

    return (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-app-text-lighter mb-3">Categories</h3>
                <div className="space-y-1">
                    {categoriesWithAll.map((cat: any) => (
                        <button
                            key={cat.slug}
                            onClick={() => updateFilter("category", cat.slug)}
                            className={`block w-full text-left px-3.5 py-2.5 text-sm rounded-xl transition-all ${
                                category === cat.slug
                                    ? "bg-app-green text-white font-medium shadow-sm"
                                    : "text-zinc-600 hover:bg-zinc-50"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-app-text-lighter mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => updateFilter("minPrice", e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 rounded-xl border border-app-border/50 focus:bg-white focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all"
                    />
                    <span className="text-app-text-lighter text-xs">to</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => updateFilter("maxPrice", e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 rounded-xl border border-app-border/50 focus:bg-white focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all"
                    />
                </div>
            </div>

            {hasFilters && (
                <button onClick={clearFilters} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
                    <XCircleIcon className="size-4" /> Clear All Filters
                </button>
            )}
        </div>
    );
};

export default FilterPanel;
