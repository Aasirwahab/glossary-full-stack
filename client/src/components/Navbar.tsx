import { ArrowUpRightIcon, BikeIcon, ChevronDownIcon, GlobeIcon, HeartIcon, HomeIcon, LogOutIcon, MapPinIcon, MenuIcon, PackageIcon, SearchIcon, SettingsIcon, ShieldIcon, ShoppingCartIcon, SparklesIcon, UserIcon, XIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount, setIsCartOpen } = useCart();
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [mobileSearchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setMobileSearchOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate("/");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Desktop & Tablet Navbar */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-soft border-b border-white/50" : "bg-white border-b border-app-border/50"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-app-green to-app-green-lighter flex-center transition-transform group-hover:scale-105">
                            <BikeIcon size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-app-green hidden sm:block">Instacart</span>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <div className="hidden lg:flex items-center gap-1">
                        {[
                            { to: "/", label: t("nav.home") },
                            { to: "/products", label: t("nav.products") },
                            { to: "/deals", label: t("nav.deals"), highlight: true },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    isActive(link.to)
                                        ? "bg-app-green text-white"
                                        : link.highlight
                                          ? "text-app-orange hover:bg-orange-50"
                                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                }`}
                            >
                                {link.highlight && <SparklesIcon className="size-3.5 inline mr-1" />}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Search - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
                        <div className="relative w-full group">
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 group-focus-within:text-app-green transition-colors" />
                            <input
                                type="text"
                                placeholder={t("nav.search")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 rounded-xl text-sm border border-transparent focus:bg-white focus:border-app-green/20 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.08)] transition-all"
                            />
                        </div>
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Mobile Search Toggle */}
                        <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden p-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
                            <SearchIcon className="size-5 text-zinc-600" />
                        </button>

                        {/* Language Switcher */}
                        <div className="relative hidden sm:block">
                            <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="p-2.5 rounded-xl hover:bg-zinc-50 transition-colors" title="Language">
                                <GlobeIcon className="size-5 text-zinc-600" />
                            </button>
                            <AnimatePresence>
                                {langMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                                        <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-elevated border border-app-border/50 py-1.5 z-50 overflow-hidden">
                                            {LANGUAGES.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        i18n.changeLanguage(lang.code);
                                                        document.documentElement.dir = lang.code === "ar" ? "rtl" : "ltr";
                                                        document.documentElement.lang = lang.code;
                                                        setLangMenuOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-zinc-50 transition-colors ${i18n.language === lang.code ? "font-medium text-app-green bg-app-green-soft/50" : "text-zinc-600"}`}
                                                >
                                                    <span className="text-base">{lang.flag}</span>
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Wishlist */}
                        {user && (
                            <Link to="/wishlist" className="hidden sm:flex p-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
                                <HeartIcon className="size-5 text-zinc-600" />
                            </Link>
                        )}

                        {/* Cart */}
                        <button className="relative p-2.5 rounded-xl hover:bg-zinc-50 transition-colors" onClick={() => setIsCartOpen(true)}>
                            <ShoppingCartIcon className="size-5 text-zinc-700" />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 size-5 bg-app-orange text-white text-[10px] font-semibold rounded-full flex-center"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* User */}
                        <div className="relative">
                            {user ? (
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-50 transition-colors">
                                    <div className="size-8 rounded-full bg-gradient-to-br from-app-green to-app-green-lighter text-white flex-center text-sm font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDownIcon className={`size-3.5 text-zinc-400 transition-transform hidden sm:block ${userMenuOpen ? "rotate-180" : ""}`} />
                                </button>
                            ) : (
                                <div className="flex-center gap-2">
                                    <Link to="/login" className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-app-green rounded-xl hover:bg-app-green-light transition-all hover:shadow-md active:scale-[0.98]">
                                        <UserIcon size={15} /> {t("nav.signIn")}
                                    </Link>
                                    <button className="md:hidden p-2.5 rounded-xl hover:bg-zinc-50" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                                        {userMenuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
                                    </button>
                                </div>
                            )}

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-elevated border border-app-border/50 py-2 z-50 overflow-hidden"
                                        >
                                            {user && (
                                                <div className="px-4 py-3 border-b border-app-border/50">
                                                    <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                                                    <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
                                                </div>
                                            )}
                                            <div className="py-1" onClick={() => setUserMenuOpen(false)}>
                                                {!user && (
                                                    <Link to="/login" className="dropdown-link">
                                                        <UserIcon size={16} /> {t("nav.signIn")}
                                                    </Link>
                                                )}
                                                {user && (
                                                    <>
                                                        <Link to="/profile" className="dropdown-link"><SettingsIcon size={16} /> {t("nav.profile")}</Link>
                                                        <Link to="/wishlist" className="dropdown-link"><HeartIcon size={16} /> {t("nav.wishlist")}</Link>
                                                        <Link to="/orders" className="dropdown-link"><PackageIcon size={16} /> {t("nav.myOrders")}</Link>
                                                        <Link to="/addresses" className="dropdown-link"><MapPinIcon size={16} /> {t("nav.addresses")}</Link>
                                                    </>
                                                )}
                                                <div className="lg:hidden border-t border-app-border/50 my-1 pt-1">
                                                    <Link to="/products" className="dropdown-link"><ArrowUpRightIcon size={16} /> {t("nav.products")}</Link>
                                                    <Link to="/deals" className="dropdown-link"><SparklesIcon size={16} /> {t("nav.deals")}</Link>
                                                </div>
                                                {user?.isAdmin && (
                                                    <div className="border-t border-app-border/50 my-1 pt-1">
                                                        <Link to="/admin/products" className="dropdown-link">
                                                            <ShieldIcon className="text-app-orange" size={16} /> <span className="text-app-orange font-medium">{t("nav.adminPanel")}</span>
                                                        </Link>
                                                    </div>
                                                )}
                                                {user && (
                                                    <div className="border-t border-app-border/50 mt-1 pt-1">
                                                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors rounded-b-xl">
                                                            <LogOutIcon size={16} /> {t("nav.logout")}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Expandable */}
                <AnimatePresence>
                    {mobileSearchOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="md:hidden overflow-hidden border-t border-app-border/50">
                            <form onSubmit={handleSearch} className="px-4 py-3">
                                <div className="relative">
                                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={t("nav.search")}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 rounded-xl text-sm border border-transparent focus:bg-white focus:border-app-green/20 transition-all"
                                    />
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-app-border/50 safe-area-bottom">
                <div className="flex items-center justify-around py-2 px-2">
                    {[
                        { to: "/", icon: HomeIcon, label: t("nav.home") },
                        { to: "/products", icon: SearchIcon, label: t("nav.products") },
                        { to: "/deals", icon: SparklesIcon, label: t("nav.deals") },
                        { to: "/orders", icon: PackageIcon, label: t("nav.myOrders") },
                        { to: user ? "/profile" : "/login", icon: UserIcon, label: user ? t("nav.profile") : t("nav.signIn") },
                    ].map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${isActive(item.to) ? "text-app-green" : "text-zinc-400"}`}
                        >
                            <item.icon className={`size-5 ${isActive(item.to) ? "stroke-[2.5]" : ""}`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
