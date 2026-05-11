import { heroSectionData } from "../../assets/assets";

const Features = () => {
    return (
        <section className="py-10 border-b border-app-border-light mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {heroSectionData.hero_features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                        <div className="size-14 rounded-2xl bg-app-cream flex-center shrink-0 group-hover:bg-app-green-vibrant/10 transition-colors">
                            <feature.icon className="size-6 text-app-text-lighter group-hover:text-app-green transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-app-text tracking-tight uppercase">{feature.title}</p>
                            <p className="text-xs text-app-text-light mt-1 font-medium">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
