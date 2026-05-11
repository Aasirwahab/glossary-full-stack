import { appPromoBannerData, assets } from "../../assets/assets";
import { ArrowRightIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

const AppPromoBanner = () => {
    return (
        <section className="max-w-7xl mx-auto py-20 my-14 bg-gradient-to-br from-[#0a1f14] via-[#0f2518] to-[#1a3a28] rounded-3xl overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 px-8 sm:px-12 xl:px-16">
                {/* Left */}
                <div className="text-center md:text-left max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs text-emerald-300 font-medium mb-6 border border-white/10">
                        <TruckIcon className="size-3.5" /> Free delivery on first order
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-white leading-tight mb-6">{appPromoBannerData.title}</h2>
                    <p className="text-white/60 mb-10 text-lg leading-relaxed">{appPromoBannerData.description}</p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <a href="/products" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-orange-500 transition-all active:scale-[0.97] shadow-xl shadow-orange-500/30">
                            Shop Now <ArrowRightIcon className="size-5" />
                        </a>
                        <a href="#" className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm">
                            Learn More
                        </a>
                    </div>
                    <div className="flex items-center gap-6 mt-10 justify-center md:justify-start opacity-70">
                        <div className="flex items-center gap-2 text-white text-xs font-medium">
                            <ShieldCheckIcon className="size-4 text-emerald-400" /> Secure checkout
                        </div>
                        <div className="flex items-center gap-2 text-white text-xs font-medium">
                            <TruckIcon className="size-4 text-emerald-400" /> Same-day delivery
                        </div>
                    </div>
                </div>

                {/* Right - Premium Image */}
                <div className="relative w-full md:w-auto flex justify-center md:justify-end">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-emerald-500/10 rounded-[32px] blur-2xl" />
                        <div className="relative rounded-[24px] overflow-hidden shadow-2xl border border-white/10">
                            <img src={assets.delivery_person_premium} alt="Professional Delivery" className="w-full max-w-[320px] lg:max-w-[420px] object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppPromoBanner;
