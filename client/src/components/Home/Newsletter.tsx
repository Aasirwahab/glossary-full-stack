import { ArrowRightIcon, MailIcon } from "lucide-react";

const Newsletter = () => {
    return (
        <section className="bg-app-text py-20 px-8 lg:px-20 rounded-[40px] mt-20 mb-20 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none flex-center select-none font-serif text-[20vw] font-black text-white/10 whitespace-nowrap">
                FRESHMART
            </div>

            <div className="max-w-2xl mx-auto text-center relative z-10">
                <h2 className="text-4xl font-serif font-black text-white mb-4">
                    Subscribe Newsletter
                </h2>
                <p className="text-white/60 mb-10 text-lg font-medium">
                    Be the first to know about fresh arrivals and exclusive farm-to-table deals.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                    <div className="relative flex-1">
                        <MailIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-white/30" />
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            required
                            className="w-full pl-14 pr-6 py-4.5 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:border-white/20 transition-all text-sm font-bold outline-hidden"
                        />
                    </div>
                    <button type="submit" className="px-10 py-4.5 bg-app-green text-white font-black rounded-full hover:bg-app-green-dark transition-all shadow-xl active:scale-[0.98] flex-center gap-3 uppercase tracking-widest text-xs">
                        Subscribe <ArrowRightIcon className="size-4" />
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
