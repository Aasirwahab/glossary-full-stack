import { BikeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { footerData } from "../assets/assets";

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gradient-to-b from-[#0a1f14] to-[#071510] text-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-8">
                {/* Top */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 mb-5 group">
                            <div className="size-9 rounded-xl bg-white/10 flex-center border border-white/10 group-hover:bg-white/15 transition-colors">
                                <BikeIcon className="size-4.5 text-white" />
                            </div>
                            <span className="text-lg font-semibold">{footerData.brand.name}</span>
                        </Link>
                        <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">{footerData.brand.description}</p>
                        <div className="flex gap-2.5">
                            {footerData.brand.socials.map((social, i) => (
                                <a key={i} href={social.link} className="size-10 rounded-xl bg-white/5 flex-center hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all">
                                    <social.icon className="size-4 text-white/70" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Sections */}
                    {footerData.sections.map((section, i) => (
                        <div key={i}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-5">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link, j) => (
                                    <li key={j}>
                                        {link.to ? (
                                            <Link to={link.to} className="text-sm text-white/50 hover:text-white transition-colors">
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-5">{t("footer.contactUs")}</h3>
                        <ul className="space-y-3.5">
                            {footerData.contact.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <li key={i} className="flex gap-3 text-sm text-white/50">
                                        <div className="size-8 rounded-lg bg-white/5 flex-center shrink-0">
                                            <Icon className="size-3.5 text-white/60" />
                                        </div>
                                        <span className="pt-1.5">{item.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Divider + Bottom */}
                <div className="border-t border-white/5 mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/25">{footerData.bottom.copyright}</p>
                    <div className="flex gap-6">
                        {footerData.bottom.links.map((link, i) => (
                            <a key={i} href={link.href} className="text-xs text-white/25 hover:text-white/50 transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
