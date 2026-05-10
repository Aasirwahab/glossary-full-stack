import { useEffect, useState } from "react";
import { heroSectionData } from "../assets/assets";
import { Link, useSearchParams } from "react-router-dom";
import { BikeIcon, Loader2Icon, LockIcon, MailIcon, ShieldIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../config/api";

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

    // If logged-in user arrives with an invite token, auto-accept it
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

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLoginState) {
                await login(email, password);
                // After login, if there's an invite token, accept it
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
            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
                <img src={heroSectionData.hero_image} alt="" className="absolute inset-0 object-cover h-full bg-center opacity-10" />
                <div className="relative text-center px-12">
                    <h2 className="text-4xl font-semibold text-white mb-4">Welcome back to Instacart</h2>
                    <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">Fresh groceries and organic produce, delivered to your doorstep.</p>
                </div>
            </div>

            {/* LRight Side */}
            <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
                <div className="w-full max-w-md">
                    {/* Admin invite banner */}
                    {adminInviteToken && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <ShieldIcon className="size-5 text-green-700 shrink-0" />
                            <p className="text-sm text-green-800">
                                <strong>Admin Invitation</strong> — {isLoginState ? "Sign in to accept your admin role." : "Create your account to join as admin."}
                            </p>
                        </div>
                    )}

                    {/* form header message */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <BikeIcon className="size-8 text-app-green" />
                            <span className="text-2xl font-semibold text-app-green">Instacart</span>
                        </Link>
                        <h1 className="text-2xl font-semibold text-app-green mb-2">{isLoginState ? t("auth.signInTitle") : t("auth.signUpTitle")}</h1>

                        <p className="text-sm text-app-text-light">
                            {isLoginState ? t("auth.dontHaveAccount") : t("auth.alreadyHaveAccount")}
                            <button onClick={() => setIsLoginState(!isLoginState)} className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors">
                                {isLoginState ? t("auth.createOne") : t("nav.signIn")}
                            </button>
                        </p>
                    </div>

                    {/* Login / Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLoginState && (
                            <label className="text-sm flex flex-col gap-1">
                                {t("auth.name")}
                                <div className="relative">
                                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                                </div>
                            </label>
                        )}
                        <label className="text-sm flex flex-col gap-1">
                            {t("auth.email")}
                            <div className="relative">
                                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                            </div>
                        </label>
                        <label className="text-sm flex flex-col gap-1">
                            {t("auth.password")}
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                            </div>
                        </label>
                        <button type="submit" disabled={loading} className="flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50">
                            {loading ? <Loader2Icon className="animate-spin" /> : isLoginState ? t("nav.signIn") : t("auth.createOne")}
                        </button>

                        {isLoginState && (
                            <p className="text-center text-sm mt-2">
                                <Link to="/forgot-password" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                                    {t("auth.forgotPassword")}
                                </Link>
                            </p>
                        )}
                    </form>

                    {/* Delivery Partner Link */}
                    <div className="mt-6 pt-6 border-t border-app-border text-center">
                        <p className="text-xs text-app-text-light mb-2">{t("auth.deliveryPartner")}</p>
                        <Link to="/delivery/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-app-green hover:text-app-green-light transition-colors">
                            <BikeIcon className="size-4" /> {t("auth.goToDeliveryLogin")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
