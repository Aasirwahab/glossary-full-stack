import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BikeIcon, Loader2Icon, LockIcon } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/reset-password", { token, password });
            setSuccess(true);
            toast.success("Password reset successfully!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex-center px-4 bg-app-cream">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-red-600 mb-4">Invalid Reset Link</h1>
                    <p className="text-app-text-light mb-6">This password reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex-center px-4 bg-app-cream">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <BikeIcon className="size-8 text-app-green" />
                        <span className="text-2xl font-semibold text-app-green">Instacart</span>
                    </Link>
                    <h1 className="text-2xl font-semibold text-app-green mb-2">Reset your password</h1>
                    <p className="text-sm text-app-text-light">Enter your new password below.</p>
                </div>

                {success ? (
                    <div className="bg-white rounded-2xl border border-app-border p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex-center mx-auto mb-4">
                            <LockIcon className="size-8 text-green-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Password Reset!</h2>
                        <p className="text-sm text-app-text-light mb-6">Your password has been updated. You can now sign in.</p>
                        <Link to="/login" className="inline-block px-6 py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors">
                            Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="text-sm flex flex-col gap-1">
                            New Password
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 8 characters" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                            </div>
                        </label>
                        <label className="text-sm flex flex-col gap-1">
                            Confirm Password
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter password" className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                            </div>
                        </label>
                        <button type="submit" disabled={loading} className="flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50">
                            {loading ? <Loader2Icon className="animate-spin" /> : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
