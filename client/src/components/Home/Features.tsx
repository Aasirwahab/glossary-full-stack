import { heroSectionData } from "../../assets/assets";

const Features = () => {
    return (
        <section className="bg-white py-5 px-2 rounded-2xl shadow-soft border border-app-border/30">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {heroSectionData.hero_features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3.5 py-3 group">
                            <div className="size-11 rounded-xl bg-gradient-to-br from-app-green-soft to-emerald-50 flex-center shrink-0 group-hover:scale-105 transition-transform">
                                <feature.icon className="size-5 text-app-green" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-app-text">{feature.title}</p>
                                <p className="text-xs text-app-text-light mt-0.5">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
