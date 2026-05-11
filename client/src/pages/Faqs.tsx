import { useState } from "react";
import { ChevronDownIcon, MessageCircleQuestionIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const faqCategories = [
    {
        category: "Orders & Delivery",
        faqs: [
            { q: "How do I place an order?", a: "Browse our products, add items to your cart, and proceed to checkout. Choose your delivery slot, add your address, and complete payment. You'll receive a confirmation email with your order details." },
            { q: "What are the delivery hours?", a: "We deliver from 8:00 AM to 9:00 PM, seven days a week. Same-day delivery is available for orders placed before 12:00 PM." },
            { q: "Can I schedule a delivery for later?", a: "Yes! During checkout, you can select a 2-hour delivery window for today or any day within the next 7 days." },
            { q: "What happens if I'm not home during delivery?", a: "Our delivery partner will call you 10 minutes before arrival. If you're unavailable, you can designate a safe drop-off location or reschedule the delivery." },
            { q: "Is there a minimum order amount?", a: "There's no minimum order amount. However, orders under $50 will incur a $4.99 delivery fee. Orders above $50 get free delivery." },
        ],
    },
    {
        category: "Products & Quality",
        faqs: [
            { q: "Are your products really organic?", a: "Yes, all products labeled organic are sourced from certified organic farms. We maintain strict partnerships with verified suppliers and conduct regular quality audits." },
            { q: "How do you ensure product freshness?", a: "We use temperature-controlled storage and packaging. Products are packed just before dispatch, and our delivery fleet maintains the cold chain throughout transit." },
            { q: "What if I receive a damaged or wrong item?", a: "Contact us within 4 hours for perishable items or 24 hours for non-perishables. We'll arrange a replacement or full refund — photo evidence helps us process it faster." },
            { q: "Do you carry gluten-free or vegan products?", a: "Absolutely! Use our filters on the products page to browse by dietary preference including gluten-free, vegan, keto, and more." },
        ],
    },
    {
        category: "Account & Payments",
        faqs: [
            { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, Apple Pay, Google Pay, PayPal, and Stripe. All transactions are secured with 256-bit SSL encryption." },
            { q: "How do I track my order?", a: "Once your order is dispatched, you'll receive a tracking link via email and SMS. You can also track it in real-time from the 'My Orders' section in your account." },
            { q: "Can I cancel or modify my order?", a: "You can cancel or modify your order up until it's been packed. Go to 'My Orders', select the order, and choose 'Cancel' or 'Modify'. If the order is already packed, please contact support." },
            { q: "How do referral rewards work?", a: "Share your unique referral code with friends. When they complete their first order, both of you receive a $10 credit applied to your next purchase." },
        ],
    },
    {
        category: "Returns & Refunds",
        faqs: [
            { q: "What is your return policy?", a: "Perishable items can be returned within 4 hours, and non-perishable sealed items within 7 days. We process refunds within 3-5 business days to your original payment method." },
            { q: "How do I request a refund?", a: "Go to 'My Orders', select the order, and click 'Request Refund'. Provide details and optional photos. Our team will review and process it within 24 hours." },
            { q: "Do you offer exchanges?", a: "For non-perishable items, we offer exchanges for the same or similar product. For perishables, we provide a full refund or credit for your next order." },
        ],
    },
];

const FaqItem = ({ faq }: { faq: { q: string; a: string } }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b border-app-border-light last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
            >
                <span className="text-sm font-bold text-app-text group-hover:text-app-green transition-colors">{faq.q}</span>
                <ChevronDownIcon className={`size-4 text-app-text-lighter shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-app-green" : ""}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="text-sm text-app-text-light leading-relaxed pb-5">{faq.a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Faqs = () => {
    return (
        <div className="min-h-screen bg-white pb-24 md:pb-8">
            {/* Hero Banner */}
            <section className="relative overflow-hidden bg-hero-gradient py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-center">
                    <span className="text-[20vw] font-serif font-black text-white whitespace-nowrap">FAQ</span>
                </div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/70 text-sm sm:text-base max-w-xl mx-auto font-medium"
                    >
                        Got questions? We've got answers. Find what you need below.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="space-y-12">
                    {faqCategories.map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-lg sm:text-xl font-bold text-app-text mb-4">{cat.category}</h2>
                            <div className="bg-white rounded-[24px] border border-app-border-light px-6 sm:px-8">
                                {cat.faqs.map((faq, j) => (
                                    <FaqItem key={j} faq={faq} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Still need help */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-app-cream rounded-[32px] p-8 sm:p-12 text-center"
                >
                    <MessageCircleQuestionIcon className="size-10 text-app-green mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-app-text mb-2">Still have questions?</h3>
                    <p className="text-sm text-app-text-lighter mb-6 max-w-md mx-auto">Can't find the answer you're looking for? Our support team is here to help.</p>
                    <Link
                        to="/support"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-app-text text-white font-black rounded-full hover:bg-app-green transition-all text-xs uppercase tracking-widest"
                    >
                        Contact Support
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Faqs;
