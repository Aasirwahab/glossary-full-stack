import { TruckIcon, XIcon, ZapIcon } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Banner = () => {
    const [bannerVisible, setBannerVisible] = useState(() => {
        return sessionStorage.getItem("banner_dismissed") !== "true";
    });

    const dismissBanner = () => {
        setBannerVisible(false);
        sessionStorage.setItem("banner_dismissed", "true");
    };

    return (
        <AnimatePresence>
            {bannerVisible && (
                <motion.div
                    initial={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-r from-[#0a1f14] via-[#0f2518] to-[#0a1f14] text-white text-xs sm:text-sm relative overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex-center gap-6">
                        <div className="flex-center gap-2">
                            <TruckIcon className="size-4 shrink-0 text-emerald-300" />
                            <span className="font-medium">Free delivery on orders above $20</span>
                        </div>
                        <span className="hidden sm:inline text-white/20">|</span>
                        <div className="hidden sm:flex items-center gap-2 text-white/70">
                            <ZapIcon className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span>Farm-fresh produce delivered daily</span>
                        </div>
                    </div>

                    <button onClick={dismissBanner} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="size-3.5 text-white/50" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Banner;
