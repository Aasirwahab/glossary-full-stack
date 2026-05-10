import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";

interface WishlistContextType {
    wishlistIds: Set<string>;
    toggle: (productId: string) => void;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    // Fetch wishlist on login
    useEffect(() => {
        if (!user) {
            setWishlistIds(new Set());
            return;
        }
        setLoading(true);
        api.get("/wishlist")
            .then(({ data }) => {
                setWishlistIds(new Set(data.wishlist.map((p: any) => p.id)));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user]);

    const toggle = async (productId: string) => {
        if (!user) {
            toast.error("Please login to save items");
            return;
        }

        const isInWishlist = wishlistIds.has(productId);

        // Optimistic update
        setWishlistIds((prev) => {
            const next = new Set(prev);
            if (isInWishlist) next.delete(productId);
            else next.add(productId);
            return next;
        });

        try {
            if (isInWishlist) {
                await api.delete(`/wishlist/${productId}`);
            } else {
                await api.post(`/wishlist/${productId}`);
                toast.success("Added to wishlist");
            }
        } catch (error: any) {
            // Revert on failure
            setWishlistIds((prev) => {
                const next = new Set(prev);
                if (isInWishlist) next.add(productId);
                else next.delete(productId);
                return next;
            });
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlistIds, toggle, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within WishlistProvider");
    return context;
}
