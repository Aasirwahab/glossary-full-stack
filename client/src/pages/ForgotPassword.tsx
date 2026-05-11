import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2Icon, MailIcon } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            setSent(true);
            toast.success("If an account exists, a reset link has been sent.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex-center px-4 bg-app-cream">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6">
                        <img src={assets.logo} alt="FreshMart Logo" className="h-10 w-auto object-contain" />
                        <span className="text-2xl font-semibold text-app-green">FreshMart</span>
                    </Link>
                    <h1 className="text-2xl font-semibold text-app-green mb-2">Forgot your password?</h1>
                    <p className="text-sm text-app-text-light">Enter your email and we'll send you a reset link.</p>
                </div>

                {sent ? (
                    <div className="bg-white rounded-2xl border border-app-border p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex-center mx-auto mb-4">
                            <MailIcon className="size-8 text-green-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Check your email</h2>
                        <p className="text-sm text-app-text-light mb-6">We've sent a password reset link to <strong>{email}</strong></p>
                        <Link to="/login" className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="text-sm flex flex-col gap-1">
                            Email Address
                            <div className="relative">
                                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                            </div>
                        </label>
                        <button type="submit" disabled={loading} className="flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50">
                            {loading ? <Loader2Icon className="animate-spin" /> : "Send Reset Link"}
                        </button>
                        <p className="text-center text-sm">
                            <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                                Back to Sign In
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
