import { LeafIcon, TruckIcon, ShieldCheckIcon, UsersIcon, AwardIcon, HeartIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const values = [
    { icon: LeafIcon, title: "100% Organic", desc: "We partner exclusively with certified organic farms, ensuring every product meets the highest standards of purity and sustainability." },
    { icon: TruckIcon, title: "Same-Day Delivery", desc: "Order by noon and receive your groceries the same day. Our efficient logistics network covers the entire metro area." },
    { icon: ShieldCheckIcon, title: "Quality Assured", desc: "Every item passes through our rigorous 3-step quality check before it reaches your doorstep." },
    { icon: UsersIcon, title: "Community First", desc: "We support over 200 local farmers and producers, keeping money in the community and reducing food miles." },
    { icon: AwardIcon, title: "Award Winning", desc: "Recognized as Best Online Grocery Platform 2025 for our commitment to freshness and customer satisfaction." },
    { icon: HeartIcon, title: "Sustainability", desc: "From compostable packaging to carbon-neutral delivery routes, we're committed to protecting our planet." },
];

const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "200+", label: "Local Farmers" },
    { value: "10K+", label: "Products" },
    { value: "99.5%", label: "On-Time Delivery" },
];

const About = () => {
    return (
        <div className="min-h-screen bg-white pb-24 md:pb-8">
            {/* Hero Banner */}
            <section className="relative overflow-hidden bg-hero-gradient py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-center">
                    <span className="text-[20vw] font-serif font-black text-white whitespace-nowrap">FRESHMART</span>
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight mb-4"
                    >
                        About FreshMart
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/70 text-sm sm:text-base max-w-xl mx-auto font-medium"
                    >
                        Bringing fresh, organic groceries straight from local farms to your doorstep since 2020.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mission */}
                <section className="py-16 sm:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <span className="text-[10px] font-black text-app-green uppercase tracking-[0.2em] mb-3 block">Our Mission</span>
                            <h2 className="text-2xl sm:text-3xl font-serif font-black text-app-text tracking-tight mb-6">
                                Fresh Food For Every Family
                            </h2>
                            <p className="text-sm text-app-text-light leading-relaxed mb-4">
                                At FreshMart, we believe everyone deserves access to fresh, organic groceries without compromise. Our mission is to bring the finest locally-sourced produce and products directly from farms to your doorstep.
                            </p>
                            <p className="text-sm text-app-text-light leading-relaxed">
                                We started by connecting directly with local organic farms and building a platform that eliminates unnecessary middlemen. Today, we serve thousands of customers, delivering fresh produce and quality groceries to homes and offices every single day.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-app-cream rounded-[24px] p-6 text-center">
                                    <p className="text-2xl sm:text-3xl font-serif font-black text-app-green">{stat.value}</p>
                                    <p className="text-xs text-app-text-lighter font-bold mt-1 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Values */}
                <section className="pb-16 sm:pb-20">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-black text-app-green uppercase tracking-[0.2em] mb-3 block">Why Choose Us</span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-app-text tracking-tight">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[24px] p-6 sm:p-8 border border-app-border-light hover:shadow-premium transition-all group"
                            >
                                <div className="size-12 rounded-2xl bg-app-cream flex items-center justify-center mb-4 group-hover:bg-app-green/10 transition-colors">
                                    <value.icon className="size-6 text-app-text-lighter group-hover:text-app-green transition-colors" />
                                </div>
                                <h3 className="text-base font-bold text-app-text mb-2">{value.title}</h3>
                                <p className="text-xs text-app-text-lighter leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-app-text rounded-[32px] p-8 sm:p-14 text-center mb-16 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
                        <span className="text-[15vw] font-serif font-black text-white whitespace-nowrap">FRESH</span>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight mb-4">Ready to Shop Fresh?</h2>
                        <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">Experience the difference of farm-fresh groceries delivered to your door.</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-app-green text-white font-black rounded-full hover:bg-app-green-dark transition-all shadow-xl text-xs uppercase tracking-widest"
                        >
                            Start Shopping <ArrowRightIcon className="size-4" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
