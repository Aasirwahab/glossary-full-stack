import { useState } from "react";
import { KeyRoundIcon, Loader2Icon, SaveIcon, UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, updateUser } = useAuth();

    // Profile form
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [profileLoading, setProfileLoading] = useState(false);

    // Password form
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
        <div className="min-h-screen bg-app-cream">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-app-green mb-8">My Profile</h1>

                {/* Profile Info */}
                <div className="bg-white rounded-2xl p-6 mb-6 border border-app-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-12 rounded-full bg-green-950 text-white flex-center text-xl font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-app-green">{user?.name}</p>
                            <p className="text-sm text-app-text-light">{user?.email}</p>
                            {user?.isAdmin && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">Email</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 rounded-xl border border-app-border text-app-text-light cursor-not-allowed"
                            />
                            <p className="text-xs text-app-text-light mt-1">Email cannot be changed</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Your phone number"
                                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={profileLoading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-50"
                        >
                            {profileLoading ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                            Save Changes
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl p-6 border border-app-border">
                    <h2 className="text-lg font-semibold text-app-green mb-4 flex items-center gap-2">
                        <KeyRoundIcon className="size-5" /> Change Password
                    </h2>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">Current Password</label>
                            <input
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-950 text-white text-sm font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50"
                        >
                            {passwordLoading ? <Loader2Icon className="size-4 animate-spin" /> : <KeyRoundIcon className="size-4" />}
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
