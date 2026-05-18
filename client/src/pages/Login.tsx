import { useEffect, useState } from "react";
import { heroSectionData, assets } from "../assets/assets";
import { Link, useSearchParams } from "react-router-dom";
import { BikeIcon, CheckIcon, LeafIcon, Loader2Icon, LockIcon, MailIcon, ShieldIcon, TruckIcon, UserIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../config/api";
import { motion } from "framer-motion";

const Login = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const adminInviteToken = searchParams.get("admin_invite");
    const tabParam = searchParams.get("tab");

    const [isLoginState, setIsLoginState] = useState(tabParam !== "register");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, register, user, token } = useAuth();

    useEffect(() => {
        if (adminInviteToken && user && token) {
            api.post("/admin/invites/accept", { token: adminInviteToken })
                .then(({ data }) => {
                    toast.success(data.message);
                    window.location.href = "/admin";
                })
                .catch((err) => {
                    toast.error(err?.response?.data?.message || "Failed to accept invite");
                });
        }
    }, [adminInviteToken, user, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLoginState) {
                await login(email, password);
                if (adminInviteToken) {
                    try {
                        await api.post("/admin/invites/accept", { token: adminInviteToken });
                        toast.success("You are now an admin!");
                        window.location.href = "/admin";
                        return;
                    } catch (err: any) {
                        toast.error(err?.response?.data?.message || "Failed to accept invite");
                    }
                }
            } else {
                await register(name, email, password, adminInviteToken || undefined);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side — Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
                <img src={heroSectionData.hero_image} alt="" className="absolute inset-0 object-cover h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f14]/95 to-[#0a1f14]/80" />

                <div className="relative text-center px-16 max-w-lg">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <img src={assets.logo} alt="FreshMart Logo" className="h-16 w-auto object-contain brightness-0 invert mx-auto mb-8" />
                        <h2 className="text-3xl font-serif text-white mb-4 leading-snug">Welcome back to FreshMart</h2>
                        <p className="text-white/50 text-base leading-relaxed mb-10">Fresh groceries and organic produce, delivered to your doorstep.</p>

                        <div className="flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                                <LeafIcon className="size-3.5 text-emerald-400" /> Organic
                            </div>
                            <div className="w-px h-3 bg-white/15" />
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                                <TruckIcon className="size-3.5 text-emerald-400" /> Fast delivery
                            </div>
                            <div className="w-px h-3 bg-white/15" />
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                                <ShieldIcon className="size-3.5 text-emerald-400" /> Secure
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side — Form */}
            <div className="flex-1 flex-center px-6 py-12 bg-app-cream">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                    {/* Admin invite banner */}
                    {adminInviteToken && (
                        <div className="mb-6 bg-emerald-50 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-emerald-100 flex-center shrink-0">
                                <ShieldIcon className="size-5 text-emerald-700" />
                            </div>
                            <p className="text-sm text-emerald-800">
                                <strong>Admin Invitation</strong> — {isLoginState ? "Sign in to accept your admin role." : "Create your account to join as admin."}
                            </p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
                            <img src={assets.logo} alt="FreshMart Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
                            <span className="text-xl font-semibold text-app-green">FreshMart</span>
                        </Link>
                        <h1 className="text-2xl font-semibold text-app-text mb-2">{isLoginState ? t("auth.signInTitle") : t("auth.signUpTitle")}</h1>
                        <p className="text-sm text-app-text-light">
                            {isLoginState ? t("auth.dontHaveAccount") : t("auth.alreadyHaveAccount")}
                            <button onClick={() => setIsLoginState(!isLoginState)} className="text-app-orange ml-1 font-semibold hover:text-app-orange-dark transition-colors">
                                {isLoginState ? t("auth.createOne") : t("nav.signIn")}
                            </button>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginState && (
                            <label className="text-sm font-medium flex flex-col gap-1.5">
                                {t("auth.name")}
                                <div className="relative">
                                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border border-app-border/60 focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all" />
                                </div>
                            </label>
                        )}
                        <label className="text-sm font-medium flex flex-col gap-1.5">
                            {t("auth.email")}
                            <div className="relative">
                                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border border-app-border/60 focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all" />
                            </div>
                        </label>
                        <label className="text-sm font-medium flex flex-col gap-1.5">
                            {t("auth.password")}
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border border-app-border/60 focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all" />
                            </div>
                        </label>

                        {/* Password Strength Indicator (Registration only) */}
                        {!isLoginState && password.length > 0 && (
                            <div className="space-y-2 px-1">
                                {/* Strength Bar */}
                                <div className="flex gap-1">
                                    {[/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, /.{8,}/].map((regex, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                regex.test(password) ? "bg-app-green" : "bg-zinc-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                {/* Requirements */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {[
                                        { label: "Lowercase letter", met: /[a-z]/.test(password) },
                                        { label: "Uppercase letter", met: /[A-Z]/.test(password) },
                                        { label: "Number", met: /[0-9]/.test(password) },
                                        { label: "Special character", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
                                        { label: "8+ characters", met: password.length >= 8 },
                                    ].map((req) => (
                                        <div key={req.label} className="flex items-center gap-1.5">
                                            {req.met ? (
                                                <CheckIcon className="size-3 text-app-green shrink-0" />
                                            ) : (
                                                <XIcon className="size-3 text-zinc-300 shrink-0" />
                                            )}
                                            <span className={`text-[10px] ${req.met ? "text-app-green font-medium" : "text-zinc-400"}`}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="flex-center w-full py-3.5 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-all disabled:opacity-50 active:scale-[0.98] shadow-sm mt-2">
                            {loading ? <Loader2Icon className="animate-spin" /> : isLoginState ? t("nav.signIn") : t("auth.createOne")}
                        </button>

                        {isLoginState && (
                            <p className="text-center text-sm mt-2">
                                <Link to="/forgot-password" className="text-app-orange font-semibold hover:text-app-orange-dark transition-colors">
                                    {t("auth.forgotPassword")}
                                </Link>
                            </p>
                        )}
                    </form>

                    {/* Delivery Partner */}
                    <div className="mt-8 pt-6 border-t border-app-border/50 text-center">
                        <p className="text-xs text-app-text-lighter mb-2">{t("auth.deliveryPartner")}</p>
                        <Link to="/delivery/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-app-green hover:text-app-green-lighter transition-colors">
                            <BikeIcon className="size-4" /> {t("auth.goToDeliveryLogin")}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
