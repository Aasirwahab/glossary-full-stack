import { ArrowRightIcon, ClockIcon, LeafIcon, SearchIcon } from "lucide-react";
import { heroSectionData } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";

const Hero = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <section className="relative overflow-hidden min-h-[600px] lg:min-h-[750px] flex items-center">
            <img src={heroSectionData.hero_image} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />

            {/* Premium Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/90 via-[#0a1f14]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f14]/30 via-transparent to-[#0a1f14]/20" />

            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 w-full">
                <div className="max-w-xl">
                    {/* Delivery badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/15 mb-6">
                        <div className="size-6 rounded-full bg-emerald-400/20 flex-center">
                            <ClockIcon className="size-3.5 text-emerald-300" />
                        </div>
                        <span className="text-sm font-medium text-emerald-200">Delivery in 30 min</span>
                    </div>

                    <div>
                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] text-white leading-[1.1] mb-5">
                            Nourish your home with{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-200">
                                Earth's finest
                            </span>
                        </h1>
                    </div>

                    <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-md">
                        {heroSectionData.description}
                    </p>

                    {/* Search bar in hero */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="relative max-w-lg">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search for groceries, fruits, vegetables..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-32 py-4 bg-white/95 backdrop-blur-sm rounded-2xl text-sm text-zinc-800 shadow-elevated focus:shadow-premium focus:bg-white transition-all placeholder:text-zinc-400"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-all active:scale-[0.97]">
                                Search
                            </button>
                        </div>
                    </form>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3">
                        <Link to="/products" className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-500 transition-all flex-center gap-2 active:scale-[0.97] shadow-lg shadow-orange-500/20">
                            {t("home.shopNow")} <ArrowRightIcon className="size-4" />
                        </Link>
                        <Link to="/products" className="px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                            {t("home.categories")}
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex items-center gap-6 mt-10">
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                            <LeafIcon className="size-3.5 text-emerald-400" />
                            <span>100% Organic</span>
                        </div>
                        <div className="w-px h-3 bg-white/20" />
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                            <span>Free delivery on $20+</span>
                        </div>
                        <div className="w-px h-3 bg-white/20 hidden sm:block" />
                        <div className="hidden sm:flex items-center gap-2 text-white/50 text-xs">
                            <span>10,000+ happy customers</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
