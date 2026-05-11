import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { HeartIcon, Minus, Plus, ShoppingCartIcon, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const { addToCart, items: cartItems, updateQuantity, removeFromCart } = useCart();
    const { wishlistIds, toggle } = useWishlist();
    const navigate = useNavigate();
    const isWishlisted = wishlistIds.has(product.id);

    const cartItem = cartItems?.find((item) => item.product.id === product.id);
    const quantity = cartItem?.quantity || 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-app-border/30 hover:border-app-border/60"
            onClick={() => navigate(`/products/${product.id}`)}
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100/50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover p-5 group-hover:p-3 transition-all duration-500 group-hover:scale-105" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {product.discount > 0 && (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-sm">
                            {product.discount}% OFF
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggle(product.id);
                    }}
                    className="absolute top-3 right-3 size-9 rounded-xl bg-white/90 backdrop-blur-sm flex-center hover:bg-white transition-all shadow-sm hover:shadow-md active:scale-90"
                >
                    <HeartIcon className={`size-4 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : "text-zinc-400"}`} />
                </button>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-sm font-medium leading-snug mb-1.5 line-clamp-2 text-app-text group-hover:text-app-green transition-colors">{product.name}</h3>

                {/* Rating */}
                {product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-2.5">
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 rounded-md">
                            <Star className="size-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-semibold text-amber-700">{product.rating}</span>
                        </div>
                        <span className="text-[11px] text-app-text-lighter">({product.reviewCount})</span>
                    </div>
                )}

                {/* Price + Cart */}
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-semibold text-app-text">
                            {currency}{product.price.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-app-text-lighter">/{product.unit}</span>
                        {product.originalPrice > product.price && (
                            <span className="text-xs text-app-text-lighter line-through ml-1">
                                {currency}{product.originalPrice.toFixed(1)}
                            </span>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {quantity > 0 ? (
                            <motion.div
                                key="stepper"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                                    className="size-8 rounded-lg bg-zinc-100 flex-center hover:bg-zinc-200 transition-colors active:scale-90"
                                >
                                    <Minus className="size-3.5 text-zinc-600" />
                                </button>
                                <span className="w-7 text-center text-sm font-semibold">{quantity}</span>
                                <button
                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                    className="size-8 rounded-lg bg-app-green flex-center hover:bg-app-green-light transition-colors active:scale-90"
                                >
                                    <Plus className="size-3.5 text-white" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="add"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                }}
                                className="size-9 rounded-xl bg-app-green text-white flex-center shrink-0 hover:bg-app-green-light transition-all active:scale-90 shadow-sm"
                            >
                                <ShoppingCartIcon className="size-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
