import { ArrowRightIcon, MailIcon, SparklesIcon } from "lucide-react";

const Newsletter = () => {
    return (
        <section className="bg-white py-16 sm:py-20 px-6 sm:px-10 lg:px-16 rounded-3xl mx-auto shadow-soft mt-20 mb-20 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-100/30 rounded-full blur-3xl" />

            <div className="max-w-xl mx-auto text-center relative">
                <div className="size-14 bg-gradient-to-br from-app-green-soft to-emerald-50 rounded-2xl flex-center mx-auto mb-6 border border-emerald-100/50">
                    <MailIcon className="size-6 text-app-green" strokeWidth={1.5} />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-app-orange bg-orange-50 rounded-full mb-4">
                    <SparklesIcon className="size-3" /> Exclusive deals every week
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-app-text mb-3">Stay in the Loop</h2>
                <p className="text-app-text-light mb-8 text-sm sm:text-base leading-relaxed">Get weekly updates on fresh produce, seasonal offers, and exclusive discounts right to your inbox.</p>

                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="relative flex-1">
                        <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            required
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-app-border bg-zinc-50 focus:bg-white focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] text-sm transition-all"
                        />
                    </div>
                    <button type="submit" className="px-7 py-3.5 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-all shadow-sm active:scale-[0.98] flex-center gap-2 whitespace-nowrap">
                        Subscribe <ArrowRightIcon className="size-4" />
                    </button>
                </form>

                <p className="text-xs text-zinc-400 mt-4">No spam, unsubscribe anytime.</p>
            </div>
        </section>
    );
};

export default Newsletter;
