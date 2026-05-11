import { ArrowRightIcon } from "lucide-react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SparkleDecor = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
);

const Hero = () => {
    return (
        <section className="relative px-3 sm:px-6 lg:px-6 py-3 sm:py-4 max-w-[1440px] mx-auto overflow-hidden">
            <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden min-h-[420px] sm:min-h-[500px] lg:min-h-[650px] bg-hero-gradient">

                {/* FreshMart text - BEHIND the person */}
                <div className="absolute inset-0 flex items-start justify-center pointer-events-none select-none z-[1] pt-[18%] sm:pt-[15%] lg:pt-[8%]">
                    <h1 className="text-[22vw] sm:text-[26vw] lg:text-[180px] xl:text-[220px] font-serif font-black tracking-tighter whitespace-nowrap leading-none">
                        <span className="text-[#c8e96a]">Fresh</span><span className="text-white">Mart</span>
                    </h1>
                </div>

                {/* Sparkle decorations */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-10 sm:top-16 left-[6%] sm:left-[8%] z-[3] text-[#c8e96a]"
                >
                    <SparkleDecor className="size-4 sm:size-5" />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute top-20 sm:top-28 left-[12%] sm:left-[14%] z-[3] text-[#c8e96a]"
                >
                    <SparkleDecor className="size-2.5 sm:size-3" />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-16 sm:top-24 right-[32%] z-[3] text-[#c8e96a]"
                >
                    <SparkleDecor className="size-3 sm:size-4" />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-[45%] sm:bottom-[40%] left-[4%] sm:left-[5%] z-[3] text-[#c8e96a]"
                >
                    <SparkleDecor className="size-3 sm:size-4" />
                </motion.div>

                {/* Centered delivery person - IN FRONT of the text */}
                <div className="absolute inset-0 flex items-end justify-center z-[2]">
                    <motion.img
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        src="/Hero_image.png"
                        alt="Delivery person"
                        className="h-[300px] sm:h-[400px] lg:h-[620px] object-contain"
                    />
                </div>

                {/* Same Day Delivery badge - rotated sticker */}
                <motion.div
                    initial={{ opacity: 0, rotate: 20, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: -20, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="absolute top-5 right-[8%] sm:top-8 sm:right-[12%] lg:top-12 lg:right-[20%] z-[4]"
                >
                    <div className="bg-[#c8e96a] text-[#0a4a2e] px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full font-black text-[8px] sm:text-[10px] lg:text-xs uppercase tracking-wider shadow-lg">
                        Same Day Delivery
                    </div>
                </motion.div>

                {/* Bottom-left content: description + CTA */}
                <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 lg:bottom-12 lg:left-14 z-[4] max-w-[55%] sm:max-w-xs lg:max-w-sm">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/80 text-[11px] sm:text-sm lg:text-base mb-3 sm:mb-6 font-medium leading-relaxed"
                    >
                        Shop from thousands of farm-fresh fruits, vegetables, dairy, and daily essentials at unbeatable prices.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link to="/products" className="inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-8 sm:py-4 bg-[#071912] text-white font-black rounded-full hover:bg-black transition-all shadow-2xl group text-[10px] sm:text-xs uppercase tracking-widest">
                            Shop Now
                            <div className="size-5 sm:size-6 bg-white/20 rounded-full flex-center group-hover:translate-x-1 transition-transform">
                                <ArrowRightIcon className="size-3" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Floating Product Card - hidden on very small screens, visible from sm up */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        y: [0, -3, 0],
                    }}
                    transition={{
                        opacity: { delay: 0.6 },
                        x: { delay: 0.6 },
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="hidden sm:flex absolute bottom-10 right-8 lg:bottom-14 lg:right-14 z-[4] bg-white/95 backdrop-blur-md rounded-[24px] p-4 shadow-premium flex-col gap-3 min-w-[170px] border border-white/20"
                >
                    <div className="size-18 rounded-2xl bg-app-cream flex-center overflow-hidden">
                        <img src={assets.hero_bg_premium} alt="Product" className="w-full h-full object-cover scale-125" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-app-text">Fresh Vegetables</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-black text-app-text">$18.00</p>
                            <p className="text-[10px] text-app-text-lighter line-through">$24.00</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
