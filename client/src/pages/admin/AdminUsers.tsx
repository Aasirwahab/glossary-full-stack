import { useEffect, useState } from "react";
import { Loader2Icon, ShieldIcon, UserIcon, UsersIcon } from "lucide-react";
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

export default function AdminUsers() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get("/admin/users");
            setUsers(data.users);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
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
            <div>
                <h1 className="text-2xl font-semibold text-zinc-900">User Management</h1>
                <p className="text-sm text-app-text-light mt-1">
                    {users.length} total users • {admins.length} admins • {regularUsers.length} regular users
                </p>
            </div>

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
