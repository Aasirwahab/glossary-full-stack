import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, MessageSquareIcon, BookOpenIcon, TruckIcon, ShieldCheckIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const contactMethods = [
    { icon: MailIcon, title: "Email Us", desc: "Get a response within 24 hours", value: "helloquery@gmail.com", action: "mailto:helloquery@gmail.com" },
    { icon: PhoneIcon, title: "Call Us", desc: "Available during business hours", value: "+00 887-254-887", action: "tel:+00887254887" },
    { icon: MapPinIcon, title: "Visit Us", desc: "Our headquarters", value: "Aurora, Colorado, US", action: null },
    { icon: ClockIcon, title: "Business Hours", desc: "Monday to Sunday", value: "8:00 AM - 9:00 PM", action: null },
];

const helpTopics = [
    { icon: TruckIcon, title: "Order & Delivery", desc: "Track orders, delivery issues, rescheduling", link: "/faqs" },
    { icon: ShieldCheckIcon, title: "Returns & Refunds", desc: "Return policy, refund status, exchanges", link: "/policy" },
    { icon: MessageSquareIcon, title: "Account Help", desc: "Login issues, profile settings, payments", link: "/faqs" },
    { icon: BookOpenIcon, title: "Product Information", desc: "Quality, sourcing, dietary info", link: "/faqs" },
];

const Support = () => {
    return (
        <div className="min-h-screen bg-white pb-24 md:pb-8">
            {/* Hero Banner */}
            <section className="relative overflow-hidden bg-hero-gradient py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-center">
                    <span className="text-[20vw] font-serif font-black text-white whitespace-nowrap">HELP</span>
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight mb-4"
                    >
                        Help & Support
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/70 text-sm sm:text-base max-w-xl mx-auto font-medium"
                    >
                        We're here to help. Reach out to us or find answers to common questions.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Help Topics */}
                <section className="py-16 sm:py-20">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-black text-app-green uppercase tracking-[0.2em] mb-3 block">How Can We Help?</span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-app-text tracking-tight">Browse Help Topics</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {helpTopics.map((topic, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to={topic.link}
                                    className="block bg-white rounded-[24px] p-6 border border-app-border-light hover:shadow-premium transition-all group text-center h-full"
                                >
                                    <div className="size-14 rounded-2xl bg-app-cream flex items-center justify-center mx-auto mb-4 group-hover:bg-app-green/10 transition-colors">
                                        <topic.icon className="size-6 text-app-text-lighter group-hover:text-app-green transition-colors" />
                                    </div>
                                    <h3 className="text-sm font-bold text-app-text mb-1 group-hover:text-app-green transition-colors">{topic.title}</h3>
                                    <p className="text-xs text-app-text-lighter">{topic.desc}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="pb-16 sm:pb-20">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-black text-app-green uppercase tracking-[0.2em] mb-3 block">Get In Touch</span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-app-text tracking-tight">Contact Information</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactMethods.map((method, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="bg-app-cream rounded-[24px] p-6 text-center"
                            >
                                <div className="size-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4">
                                    <method.icon className="size-5 text-app-green" />
                                </div>
                                <h3 className="text-sm font-bold text-app-text mb-1">{method.title}</h3>
                                <p className="text-[10px] text-app-text-lighter mb-3 font-medium">{method.desc}</p>
                                {method.action ? (
                                    <a href={method.action} className="text-sm font-bold text-app-green hover:underline">{method.value}</a>
                                ) : (
                                    <p className="text-sm font-bold text-app-text">{method.value}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Contact Form */}
                <section className="pb-16 sm:pb-20">
                    <div className="bg-white rounded-[32px] border border-app-border-light p-6 sm:p-10 max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold text-app-text mb-2 text-center">Send Us a Message</h2>
                        <p className="text-xs text-app-text-lighter text-center mb-8">Fill out the form and we'll get back to you within 24 hours.</p>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-app-text mb-2">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-app-cream rounded-xl text-sm border border-transparent focus:border-app-green/20 focus:bg-white transition-all outline-none placeholder:text-app-text-lighter" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-app-text mb-2">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-app-cream rounded-xl text-sm border border-transparent focus:border-app-green/20 focus:bg-white transition-all outline-none placeholder:text-app-text-lighter" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-app-text mb-2">Subject</label>
                                <input type="text" placeholder="How can we help?" className="w-full px-4 py-3 bg-app-cream rounded-xl text-sm border border-transparent focus:border-app-green/20 focus:bg-white transition-all outline-none placeholder:text-app-text-lighter" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-app-text mb-2">Message</label>
                                <textarea rows={5} placeholder="Describe your issue or question..." className="w-full px-4 py-3 bg-app-cream rounded-xl text-sm border border-transparent focus:border-app-green/20 focus:bg-white transition-all outline-none placeholder:text-app-text-lighter resize-none" />
                            </div>
                            <button type="submit" className="w-full py-3.5 bg-app-text text-white font-black rounded-full hover:bg-app-green transition-all text-xs uppercase tracking-widest">
                                Send Message
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Support;
