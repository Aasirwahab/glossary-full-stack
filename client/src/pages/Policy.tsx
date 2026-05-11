import { ShieldCheckIcon, RotateCcwIcon, TruckIcon, CreditCardIcon, LockIcon, FileTextIcon } from "lucide-react";
import { motion } from "framer-motion";

const policies = [
    {
        icon: RotateCcwIcon,
        title: "Return & Refund Policy",
        items: [
            "Items can be returned within 24 hours of delivery if they don't meet our quality standards.",
            "Perishable goods (fruits, vegetables, dairy) must be reported within 4 hours of delivery.",
            "Refunds are processed within 3-5 business days to your original payment method.",
            "Photo evidence may be required for damaged or incorrect items.",
            "Non-perishable sealed items can be returned unopened within 7 days.",
        ],
    },
    {
        icon: TruckIcon,
        title: "Delivery Policy",
        items: [
            "Free delivery on orders above $50. Standard delivery fee of $4.99 for smaller orders.",
            "Same-day delivery available for orders placed before 12:00 PM.",
            "Delivery windows are 2-hour slots that you choose at checkout.",
            "A delivery partner will contact you 10 minutes before arrival.",
            "If you're unavailable, the order will be left at a safe place or rescheduled.",
        ],
    },
    {
        icon: CreditCardIcon,
        title: "Payment Policy",
        items: [
            "We accept Visa, Mastercard, Apple Pay, Google Pay, PayPal, and Stripe.",
            "Your card is charged only after your order is confirmed and packed.",
            "All transactions are secured with 256-bit SSL encryption.",
            "Promotional codes and discounts are applied at checkout and cannot be combined.",
            "Prices shown include applicable taxes unless stated otherwise.",
        ],
    },
    {
        icon: ShieldCheckIcon,
        title: "Quality Policy",
        items: [
            "All products pass a 3-step quality inspection before dispatch.",
            "We source directly from certified organic farms and trusted suppliers.",
            "Temperature-controlled packaging ensures freshness during transit.",
            "Best-before dates are guaranteed to have at least 5 days remaining on delivery.",
            "Products that don't meet our standards are replaced at no extra cost.",
        ],
    },
    {
        icon: LockIcon,
        title: "Privacy Policy",
        items: [
            "Your personal data is encrypted and stored securely on our servers.",
            "We never sell or share your information with third parties for marketing.",
            "You can request deletion of your account and data at any time.",
            "Cookies are used only for essential functionality and improving your experience.",
            "Payment details are processed by PCI-compliant payment providers.",
        ],
    },
    {
        icon: FileTextIcon,
        title: "Offer & Promotion Policy",
        items: [
            "Flash deals are available for a limited time and subject to stock availability.",
            "Promo codes are single-use unless stated otherwise and expire on the listed date.",
            "First-order discounts cannot be combined with other promotional offers.",
            "Referral rewards are credited after the referred user completes their first order.",
            "FreshMart reserves the right to modify or cancel promotions at any time.",
        ],
    },
];

const Policy = () => {
    return (
        <div className="min-h-screen bg-white pb-24 md:pb-8">
            {/* Hero Banner */}
            <section className="relative overflow-hidden bg-hero-gradient py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-center">
                    <span className="text-[20vw] font-serif font-black text-white whitespace-nowrap">POLICY</span>
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight mb-4"
                    >
                        Our Policies
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/70 text-sm sm:text-base max-w-xl mx-auto font-medium"
                    >
                        Transparent policies built on trust. Here's everything you need to know.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="grid gap-8">
                    {policies.map((policy, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[24px] p-6 sm:p-8 border border-app-border-light hover:shadow-premium transition-all"
                        >
                            <div className="flex items-start gap-4 mb-5">
                                <div className="size-12 rounded-2xl bg-app-cream flex items-center justify-center shrink-0">
                                    <policy.icon className="size-6 text-app-green" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-app-text pt-2">{policy.title}</h2>
                            </div>
                            <ul className="space-y-3 ml-1">
                                {policy.items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-app-text-light leading-relaxed">
                                        <span className="size-1.5 rounded-full bg-app-green shrink-0 mt-2" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Policy;
