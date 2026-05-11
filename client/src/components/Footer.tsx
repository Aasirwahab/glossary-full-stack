import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { SiVisa, SiMastercard, SiStripe, SiApplepay, SiGooglepay, SiPaypal } from "@icons-pack/react-simple-icons";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
    return (
        <footer className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
            <div className="bg-app-cream rounded-[32px] px-8 lg:px-14 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">
                    {/* Brand & Payment */}
                    <div className="lg:col-span-3">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <img src={assets.logo} alt="FreshMart Logo" className="h-10 w-auto object-contain" />
                            <h2 className="text-xl font-serif font-black text-app-text tracking-tight">FreshMart</h2>
                        </Link>
                        <p className="text-app-text-light text-sm leading-relaxed mb-6 max-w-[240px]">
                            Bringing fresh, organic groceries straight from local farms to your doorstep.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { icon: SiVisa, label: "Visa" },
                                { icon: SiMastercard, label: "Mastercard" },
                                { icon: SiStripe, label: "Stripe" },
                                { icon: SiApplepay, label: "Apple Pay" },
                                { icon: SiGooglepay, label: "Google Pay" },
                                { icon: SiPaypal, label: "PayPal" },
                            ].map((m) => (
                                <div key={m.label} className="size-10 bg-white rounded-lg flex items-center justify-center border border-app-border-light" title={m.label}>
                                    <m.icon className="size-5 text-app-text-light" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Pages */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold text-app-text mb-5">Main Pages</h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Home", to: "/" },
                                { label: "About Us", to: "/about" },
                                { label: "Product", to: "/products" },
                                { label: "Testimonial", to: "#" },
                                { label: "FAQ", to: "/faqs" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-app-text-light hover:text-app-green transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold text-app-text mb-5">Help</h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Help Center", to: "/support" },
                                { label: "Return Policy", to: "/policy" },
                                { label: "Offer Policy", to: "/policy" },
                                { label: "Grocery delivery", to: "#" },
                                { label: "Reviews", to: "#" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-app-text-light hover:text-app-green transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold text-app-text mb-5">Company</h3>
                        <ul className="space-y-3">
                            {["Jobs", "Partnerships", "List your property", "Advertising", "Investor Relations", "Feedback"].map((link) => (
                                <li key={link}>
                                    <Link to="#" className="text-sm text-app-text-light hover:text-app-green transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-bold text-app-text mb-5">Contact Information</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-app-text-light">
                                <MapPinIcon className="size-4 text-app-text-lighter shrink-0 mt-0.5" />
                                <span>Aurora, Colorado - amerika serikat, US</span>
                            </li>
                            <li className="flex gap-3 text-sm text-app-text-light">
                                <PhoneIcon className="size-4 text-app-text-lighter shrink-0 mt-0.5" />
                                <span>+00 887-254-887</span>
                            </li>
                            <li className="flex gap-3 text-sm text-app-text-light">
                                <MailIcon className="size-4 text-app-text-lighter shrink-0 mt-0.5" />
                                <span>helloquery@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-app-border-light flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-app-text-lighter font-medium">Copyright all rights reserved</p>
                    <div className="flex gap-8">
                        {["Privacy & policy", "Terms & Condition"].map((link) => (
                            <Link key={link} to="#" className="text-xs text-app-text-lighter font-medium hover:text-app-green transition-colors">{link}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
