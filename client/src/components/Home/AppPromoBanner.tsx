import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const AppPromoBanner = () => {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-[1440px] mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative rounded-[48px] overflow-hidden bg-[#0a4a2e] flex flex-col md:flex-row items-center p-10 lg:p-20 gap-12 group"
            >
                {/* Background Pattern/Gradient */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c8e96a] rounded-full blur-[120px] -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500 rounded-full blur-[100px] -ml-20 -mb-20" />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#c8e96a] text-[#0a4a2e] text-[10px] font-black uppercase tracking-widest mb-6">
                            Premium Quality
                        </span>
                        <h2 className="text-4xl lg:text-6xl font-black text-white leading-[1.05] mb-6">
                            Experience The <br />
                            <span className="text-[#c8e96a]">Freshness</span> Delivered.
                        </h2>
                        <p className="text-white/70 text-lg mb-10 max-w-md leading-relaxed">
                            Order the finest organic produce and everyday essentials from the comfort of your home. Fast, reliable, and always fresh.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <Link to="/products" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#0a4a2e] font-black rounded-full hover:bg-[#c8e96a] transition-all shadow-2xl group/btn text-xs uppercase tracking-widest">
                                Start Shopping Now
                                <div className="size-6 bg-[#0a4a2e]/10 rounded-full flex-center group-hover/btn:translate-x-1 transition-transform">
                                    <ArrowRightIcon className="size-3.5" />
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Image */}
                <div className="flex-1 flex items-center justify-center lg:justify-end z-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                        className="relative w-full max-w-[520px]"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                            <img 
                                src={assets.promo_banner} 
                                alt="Fresh Groceries" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-6 -right-6 size-24 bg-[#c8e96a] rounded-2xl -rotate-12 -z-10 blur-xl opacity-50" />
                        <div className="absolute -bottom-10 -left-10 size-40 bg-emerald-500 rounded-full -z-10 blur-2xl opacity-30" />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default AppPromoBanner;

