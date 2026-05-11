import { Link } from "react-router-dom";
import { categoriesData } from "../../assets/assets";
import { ArrowRightIcon } from "lucide-react";

const HomeCategories = () => {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-app-text">Browse Categories</h2>
                        <p className="text-sm text-app-text-light mt-1.5">Find exactly what you need</p>
                    </div>
                    <Link to="/products" className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors">
                        View All <ArrowRightIcon className="size-4" />
                    </Link>
                </div>
                <div className="flex items-start gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-4">
                    {categoriesData.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            onClick={() => window.scrollTo(0, 0)}
                            className="group flex flex-col items-center gap-3 p-3 sm:p-4 shrink-0"
                        >
                            <div className="size-20 sm:size-28 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/50 group-hover:border-orange-200 group-hover:shadow-elevated transition-all duration-300 p-2 sm:p-3">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-zinc-600 text-center leading-tight group-hover:text-app-green transition-colors">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeCategories;
