import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircleIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import api from "../config/api";
import { assets } from "../assets/assets";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }
        api.post("/auth/verify-email", { token })
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, [token]);

    return (
        <div className="min-h-screen flex-center px-4 bg-app-cream">
            <div className="w-full max-w-md text-center">
                <Link to="/" className="inline-flex items-center gap-3 mb-8">
                    <img src={assets.logo} alt="FreshMart Logo" className="h-10 w-auto object-contain" />
                    <span className="text-2xl font-semibold text-app-green">FreshMart</span>
                </Link>

                <div className="bg-white rounded-2xl border border-app-border p-8">
                    {status === "loading" && (
                        <>
                            <Loader2Icon className="size-12 text-app-green animate-spin mx-auto mb-4" />
                            <h2 className="text-lg font-semibold text-zinc-900">Verifying your email...</h2>
                        </>
                    )}
                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex-center mx-auto mb-4">
                                <CheckCircleIcon className="size-8 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-zinc-900 mb-2">Email Verified!</h2>
                            <p className="text-sm text-app-text-light mb-6">Your email has been verified. You can now use all features.</p>
                            <Link to="/" className="inline-block px-6 py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors">
                                Go to Home
                            </Link>
                        </>
                    )}
                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex-center mx-auto mb-4">
                                <XCircleIcon className="size-8 text-red-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-zinc-900 mb-2">Verification Failed</h2>
                            <p className="text-sm text-app-text-light mb-6">This link is invalid or has already been used.</p>
                            <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                                Back to Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
