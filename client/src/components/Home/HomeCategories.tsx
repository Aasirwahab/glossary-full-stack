import { Link } from "react-router-dom";
import { categoriesData } from "../../assets/assets";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";

const HomeCategories = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-app-text tracking-tighter">Popular Categories</h2>
                <Link to="/products" className="group flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 bg-app-text text-white rounded-full text-xs sm:text-sm font-bold hover:bg-app-green transition-all shadow-lg shrink-0">
                    Show All
                    <div className="size-5 sm:size-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRightIcon className="size-3" />
                    </div>
                </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
                {categoriesData.map((cat, index) => (
                    <motion.div
                        key={cat.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            to={`/products?category=${cat.slug}`}
                            className="group flex flex-col items-center p-5 sm:p-6 bg-white rounded-[24px] sm:rounded-[32px] shadow-sm hover:shadow-premium transition-all duration-500 w-[140px] sm:w-[180px] shrink-0"
                        >
                            <div className="size-20 sm:size-24 mb-3 sm:mb-4 flex items-center justify-center">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-sm sm:text-base font-bold text-app-text group-hover:text-app-green transition-colors">{cat.name}</h3>
                                <p className="text-[10px] sm:text-xs text-app-text-lighter mt-1 font-medium">10+ Products</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HomeCategories;
