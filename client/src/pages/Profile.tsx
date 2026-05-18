import { useState } from "react";
import { KeyRoundIcon, Loader2Icon, LockIcon, LogOutIcon, PhoneIcon, SaveIcon, UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, updateUser, logout } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [profileLoading, setProfileLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }
        setProfileLoading(true);
        try {
            const { data } = await api.put("/auth/profile", { name: name.trim(), phone: phone.trim() });
            updateUser(data.user);
            toast.success("Profile updated");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setPasswordLoading(true);
        try {
            await api.put("/auth/change-password", { currentPassword, newPassword });
            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-app-cream pb-24 md:pb-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-app-text mb-8">My Profile</h1>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 shadow-soft border border-app-border/30">
                    {/* Avatar Header */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-app-border/30">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-app-green to-app-green-lighter text-white flex-center text-xl font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-app-text text-lg">{user?.name}</p>
                            <p className="text-sm text-app-text-lighter">{user?.email}</p>
                            {user?.isAdmin && (
                                <span className="inline-flex mt-1.5 text-[10px] bg-orange-50 text-orange-600 px-2.5 py-0.5 rounded-md font-semibold uppercase tracking-wider">Admin</span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-app-text mb-1.5">Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-50 rounded-xl border border-app-border/50 focus:bg-white focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-text mb-1.5">Email</label>
                            <input type="email" value={user?.email || ""} disabled placeholder="Your email address" className="w-full px-4 py-3 text-sm bg-zinc-50 rounded-xl border border-app-border/30 text-app-text-lighter cursor-not-allowed" />
                            <p className="text-xs text-app-text-lighter mt-1.5">Email cannot be changed</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-text mb-1.5">Phone</label>
                            <div className="relative">
                                <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-50 rounded-xl border border-app-border/50 focus:bg-white focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all" />
                            </div>
                        </div>
                        <button type="submit" disabled={profileLoading} className="flex items-center gap-2 px-6 py-3 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-all disabled:opacity-50 active:scale-[0.98]">
                            {profileLoading ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                            Save Changes
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 shadow-soft border border-app-border/30">
                    <h2 className="text-lg font-semibold text-app-text mb-6 flex items-center gap-2.5">
                        <div className="size-9 rounded-xl bg-zinc-50 flex-center">
                            <KeyRoundIcon className="size-4.5 text-zinc-500" />
                        </div>
                        Change Password
                    </h2>

                    <form onSubmit={handleChangePassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-app-text mb-1.5">Current Password</label>
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-50 rounded-xl border border-app-border/50 focus:bg-white focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-text mb-1.5">New Password</label>
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-50 rounded-xl border border-app-border/50 focus:bg-white focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all" />
                            </div>
                            <p className="text-[11px] text-app-text-lighter mt-1.5">Must include uppercase, lowercase, number & special character</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-text mb-1.5">Confirm New Password</label>
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-50 rounded-xl border border-app-border/50 focus:bg-white focus:border-app-green/30 focus:shadow-[0_0_0_3px_rgba(45,90,63,0.06)] transition-all" />
                            </div>
                        </div>
                        <button type="submit" disabled={passwordLoading} className="flex items-center gap-2 px-6 py-3 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-all disabled:opacity-50 active:scale-[0.98]">
                            {passwordLoading ? <Loader2Icon className="size-4 animate-spin" /> : <KeyRoundIcon className="size-4" />}
                            Change Password
                        </button>
                    </form>
                </div>

                {/* Sign Out Section */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-red-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-red-50 flex-center">
                                <LogOutIcon className="size-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-app-text">Sign Out</h3>
                                <p className="text-xs text-app-text-lighter">End your current session</p>
                            </div>
                        </div>
                        <button
                            id="profile-sign-out-button"
                            onClick={logout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-all active:scale-[0.98] border border-red-100"
                        >
                            <LogOutIcon className="size-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
