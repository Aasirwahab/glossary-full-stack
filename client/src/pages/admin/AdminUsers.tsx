import { useEffect, useState } from "react";
import { Loader2Icon, MailIcon, ShieldIcon, UserIcon, UsersIcon, XIcon, ClockIcon, SendIcon } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    _count: { orders: number };
}

interface AdminInvite {
    id: string;
    email: string;
    expiresAt: string;
    createdAt: string;
}

export default function AdminUsers() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [invites, setInvites] = useState<AdminInvite[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviting, setInviting] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);

    const fetchData = async () => {
        try {
            const [usersRes, invitesRes] = await Promise.all([api.get("/admin/users"), api.get("/admin/invites")]);
            setUsers(usersRes.data.users);
            setInvites(invitesRes.data.invites);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        setUpdatingId(userId);
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
            toast.success(`User role updated to ${newRole}`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update role");
        } finally {
            setUpdatingId(null);
        }
    };

    const sendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        setInviting(true);
        try {
            const { data } = await api.post("/admin/invites", { email: inviteEmail.trim() });
            toast.success(data.message);
            setInviteEmail("");
            setShowInviteForm(false);
            fetchData();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send invite");
        } finally {
            setInviting(false);
        }
    };

    const cancelInvite = async (id: string) => {
        try {
            await api.delete(`/admin/invites/${id}`);
            setInvites((prev) => prev.filter((i) => i.id !== id));
            toast.success("Invite cancelled");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to cancel invite");
        }
    };

    if (loading) {
        return (
            <div className="flex-center py-20">
                <Loader2Icon className="size-8 text-app-green animate-spin" />
            </div>
        );
    }

    const admins = users.filter((u) => u.role === "admin");
    const regularUsers = users.filter((u) => u.role === "user");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">User Management</h1>
                    <p className="text-sm text-app-text-light mt-1">
                        {users.length} total users • {admins.length} admins • {regularUsers.length} regular users
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className="flex items-center gap-2 bg-app-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                    <MailIcon className="size-4" /> Invite Admin
                </button>
            </div>

            {/* Invite Form */}
            {showInviteForm && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <form onSubmit={sendInvite} className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <MailIcon className="size-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="Enter email to invite as admin..."
                                className="w-full pl-10 pr-4 py-2.5 border border-green-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={inviting}
                            className="flex items-center gap-2 bg-app-green text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {inviting ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
                            Send Invite
                        </button>
                        <button type="button" onClick={() => setShowInviteForm(false)} className="p-2 text-zinc-400 hover:text-zinc-600">
                            <XIcon className="size-5" />
                        </button>
                    </form>
                    <p className="text-xs text-green-700 mt-2">An email will be sent with a link to register or accept the admin role. Invite expires in 7 days.</p>
                </div>
            )}

            {/* Pending Invites */}
            {invites.length > 0 && (
                <div>
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <ClockIcon className="size-4" /> Pending Invites ({invites.length})
                    </h2>
                    <div className="space-y-2">
                        {invites.map((invite) => (
                            <div key={invite.id} className="flex items-center justify-between bg-orange-50 rounded-xl border border-orange-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full flex-center bg-orange-100">
                                        <MailIcon className="size-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-zinc-900 text-sm">{invite.email}</p>
                                        <p className="text-xs text-app-text-light">
                                            Expires {new Date(invite.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => cancelInvite(invite.id)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Admins Section */}
            <div>
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <ShieldIcon className="size-4" /> Admins ({admins.length})
                </h2>
                <div className="space-y-2">
                    {admins.map((u) => (
                        <UserRow key={u.id} user={u} currentUserId={currentUser?.id} updatingId={updatingId} onToggleRole={toggleRole} />
                    ))}
                </div>
            </div>

            {/* Regular Users Section */}
            <div>
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <UsersIcon className="size-4" /> Users ({regularUsers.length})
                </h2>
                <div className="space-y-2">
                    {regularUsers.length === 0 ? (
                        <p className="text-sm text-app-text-light py-4 text-center">No regular users yet</p>
                    ) : (
                        regularUsers.map((u) => <UserRow key={u.id} user={u} currentUserId={currentUser?.id} updatingId={updatingId} onToggleRole={toggleRole} />)
                    )}
                </div>
            </div>
        </div>
    );
}

function UserRow({ user, currentUserId, updatingId, onToggleRole }: { user: AdminUser; currentUserId?: string; updatingId: string | null; onToggleRole: (id: string, role: string) => void }) {
    const isSelf = user.id === currentUserId;

    return (
        <div className="flex items-center justify-between bg-white rounded-xl border border-app-border p-4">
            <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full flex-center ${user.role === "admin" ? "bg-green-100" : "bg-zinc-100"}`}>
                    {user.role === "admin" ? <ShieldIcon className="size-5 text-green-700" /> : <UserIcon className="size-5 text-zinc-500" />}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-900 text-sm">{user.name}</p>
                        {isSelf && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">YOU</span>}
                        {!user.isVerified && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">UNVERIFIED</span>}
                    </div>
                    <p className="text-xs text-app-text-light">{user.email}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs text-app-text-light">{user._count.orders} orders</span>
                <button
                    onClick={() => onToggleRole(user.id, user.role)}
                    disabled={isSelf || updatingId === user.id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        user.role === "admin" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                >
                    {updatingId === user.id ? <Loader2Icon className="size-3 animate-spin" /> : user.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
            </div>
        </div>
    );
}
