import { ChevronDownIcon, GlobeIcon, HeartIcon, HelpCircleIcon, HomeIcon, LogOutIcon, MapPinIcon, PackageIcon, SearchIcon, ShoppingCartIcon, SparklesIcon, UserIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";
import type { Product } from "../types";
import api from "../config/api";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount, setIsCartOpen } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close user menu on route change
    useEffect(() => {
        setShowUserMenu(false);
    }, [location.pathname]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (searchQuery.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoadingSuggestions(true);
        debounceRef.current = setTimeout(() => {
            api.get(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
                .then((res) => {
                    setSuggestions(res.data.products?.slice(0, 6) || []);
                    setShowSuggestions(true);
                })
                .catch(() => setSuggestions([]))
                .finally(() => setLoadingSuggestions(false));
        }, 300);

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    const handleSuggestionClick = (product: Product) => {
        setShowSuggestions(false);
        setSearchQuery("");
        navigate(`/product/${product.id}`);
    };

    const handleSignOut = () => {
        setShowUserMenu(false);
        logout();
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-500 bg-white ${scrolled ? "shadow-premium" : ""}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top Row */}
                    <div className="flex items-center justify-between h-20 border-b border-app-border-light">

                        {/* Language */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-app-cream rounded-full border border-app-border-light hover:border-app-green/20 transition-all cursor-pointer group shrink-0">
                            <GlobeIcon className="size-4 text-app-text-lighter group-hover:text-app-green transition-colors" />
                            <span className="text-xs font-black text-app-text uppercase tracking-widest">EN</span>
                            <ChevronDownIcon className="size-3 text-app-text-lighter group-hover:text-app-green transition-colors" />
                        </div>

                        {/* Search Bar with Suggestions */}
                        <div ref={searchRef} className="hidden md:block relative w-56 lg:w-64 shrink-0 ml-6">
                            <form onSubmit={handleSearch}>
                                <div className="relative w-full group">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-app-text-lighter group-focus-within:text-app-green transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search Grocery Items..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                        className="w-full pl-11 pr-4 py-3 bg-app-cream rounded-full text-xs font-bold border border-transparent focus:bg-white focus:border-app-green/20 focus:shadow-soft transition-all placeholder:text-app-text-lighter"
                                    />
                                </div>
                            </form>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-premium border border-app-border-light overflow-hidden z-[60]">
                                    {loadingSuggestions ? (
                                        <div className="px-4 py-3 text-xs text-app-text-lighter text-center">Searching...</div>
                                    ) : suggestions.length > 0 ? (
                                        <>
                                            {suggestions.map((product) => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => handleSuggestionClick(product)}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-app-cream transition-colors text-left"
                                                >
                                                    <img src={product.image} alt={product.name} className="size-10 rounded-lg object-cover bg-app-cream shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-bold text-app-text truncate">{product.name}</p>
                                                        <p className="text-[10px] text-app-text-lighter">${product.price.toFixed(2)}</p>
                                                    </div>
                                                </button>
                                            ))}
                                            <button
                                                onClick={handleSearch as any}
                                                className="w-full px-4 py-2.5 text-xs font-bold text-app-green hover:bg-app-cream transition-colors border-t border-app-border-light text-center"
                                            >
                                                View all results for "{searchQuery}"
                                            </button>
                                        </>
                                    ) : (
                                        <div className="px-4 py-3 text-xs text-app-text-lighter text-center">No products found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Logo */}
                        <Link to="/" className="flex items-center justify-center group shrink-0 mx-auto gap-3">
                            <img src={assets.logo} alt="FreshMart Logo" className="h-10 w-auto object-contain transition-all group-hover:scale-105" />
                            <h1 className="text-2xl font-serif font-black text-app-text tracking-tighter transition-all group-hover:scale-105">
                                FreshMart
                            </h1>
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Link to="/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-app-cream rounded-full transition-all group">
                                <HeartIcon className="size-4.5 text-app-text group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                                <span className="hidden sm:block text-[10px] font-black text-app-text uppercase tracking-[0.15em]">Loved</span>
                            </Link>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="flex items-center gap-2.5 px-4 py-2.5 bg-app-cream rounded-full hover:bg-[#071912] hover:text-white transition-all group"
                            >
                                <div className="relative">
                                    <ShoppingCartIcon className="size-4.5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 size-4 bg-[#11a051] text-white text-[9px] font-black rounded-full flex-center border-2 border-app-cream group-hover:border-[#071912]">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.15em]">Cart</span>
                            </button>

                            {user ? (
                                <div ref={userMenuRef} className="relative">
                                    <button
                                        id="user-menu-trigger"
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 p-1 bg-app-cream rounded-full hover:shadow-soft transition-all border border-transparent hover:border-app-border"
                                    >
                                        <div className="size-9 rounded-full bg-[#071912] text-white flex-center text-xs font-black">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <ChevronDownIcon className={`size-3 text-app-text-lighter mr-1 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-premium border border-app-border-light overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                                            {/* User Info Header */}
                                            <div className="px-4 py-3.5 bg-gradient-to-r from-[#071912] to-[#0d2b1e]">
                                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                                <p className="text-[11px] text-white/50 truncate">{user.email}</p>
                                                {user.isAdmin && (
                                                    <span className="inline-flex mt-1.5 text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1.5">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-app-text hover:bg-app-cream transition-colors group"
                                                >
                                                    <div className="size-8 rounded-lg bg-zinc-50 flex-center group-hover:bg-app-green/10 transition-colors">
                                                        <UserIcon className="size-4 text-zinc-400 group-hover:text-app-green transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-xs">My Profile</p>
                                                        <p className="text-[10px] text-app-text-lighter">Edit your info</p>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/orders"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-app-text hover:bg-app-cream transition-colors group"
                                                >
                                                    <div className="size-8 rounded-lg bg-zinc-50 flex-center group-hover:bg-blue-50 transition-colors">
                                                        <PackageIcon className="size-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-xs">My Orders</p>
                                                        <p className="text-[10px] text-app-text-lighter">Track & manage</p>
                                                    </div>
                                                </Link>

                                                <Link
                                                    to="/addresses"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-app-text hover:bg-app-cream transition-colors group"
                                                >
                                                    <div className="size-8 rounded-lg bg-zinc-50 flex-center group-hover:bg-purple-50 transition-colors">
                                                        <MapPinIcon className="size-4 text-zinc-400 group-hover:text-purple-500 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-xs">Addresses</p>
                                                        <p className="text-[10px] text-app-text-lighter">Manage delivery</p>
                                                    </div>
                                                </Link>

                                                {user.isAdmin && (
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-app-text hover:bg-app-cream transition-colors group"
                                                    >
                                                        <div className="size-8 rounded-lg bg-amber-50 flex-center">
                                                            <SparklesIcon className="size-4 text-amber-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-xs">Admin Panel</p>
                                                            <p className="text-[10px] text-app-text-lighter">Manage store</p>
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Sign Out */}
                                            <div className="border-t border-app-border-light">
                                                <button
                                                    id="sign-out-button"
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                                >
                                                    <div className="size-8 rounded-lg bg-red-50 flex-center group-hover:bg-red-100 transition-colors">
                                                        <LogOutIcon className="size-4 text-red-400 group-hover:text-red-600 transition-colors" />
                                                    </div>
                                                    <p className="font-bold text-xs">Sign Out</p>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2.5 px-5 py-2.5 bg-app-cream rounded-full hover:bg-[#071912] hover:text-white transition-all group border border-app-border-light">
                                    <UserIcon className="size-4.5" />
                                    <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.15em]">Login/Signup</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="hidden lg:flex items-center justify-between py-4">
                        {/* Nav Links */}
                        <div className="flex items-center gap-8">
                            {[
                                { to: "/", label: "Shop" },
                                { to: "/products", label: "Categories", dropdown: true },
                                { to: "/deals", label: "Deals" },
                                { to: "/products?category=fresh-produce", label: "Fresh Produce" },
                                { to: "/about", label: "About" },
                            ].map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isActive(link.to) ? "text-[#11a051]" : "text-app-text-light hover:text-[#11a051]"}`}
                                >
                                    {link.label}
                                    {link.dropdown && <ChevronDownIcon className="size-3 opacity-40" />}
                                </Link>
                            ))}
                        </div>

                        {/* Utility Links */}
                        <div className="flex items-center gap-6">
                            {[
                                { to: "/policy", label: "Policy" },
                                { to: "/faqs", label: "FAQ's" },
                                { to: "/support", label: "Help & Support", icon: HelpCircleIcon },
                            ].map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    className="flex items-center gap-2 text-[10px] font-black text-app-text-lighter hover:text-app-text transition-colors uppercase tracking-[0.1em]"
                                >
                                    {link.icon && <link.icon className="size-3.5" />}
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-app-border-light safe-area-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around py-4 px-2">
                    {[
                        { to: "/", icon: HomeIcon, label: "Home" },
                        { to: "/products", icon: SearchIcon, label: "Shop" },
                        { to: "/deals", icon: SparklesIcon, label: "Deals" },
                        { to: user ? "/profile" : "/login", icon: UserIcon, label: "Profile" },
                    ].map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center gap-1.5 px-4 py-1 rounded-2xl transition-all ${isActive(item.to) ? "text-[#11a051]" : "text-app-text-lighter"}`}
                        >
                            <item.icon className={`size-5.5 ${isActive(item.to) ? "fill-[#11a051]/10" : ""}`} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
