import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { HeartIcon, Minus, Plus } from "lucide-react";
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
            className="bg-white rounded-[32px] overflow-hidden border border-app-border-light hover:shadow-premium transition-all duration-500 group cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/products/${product.id}`)}
        >
            {/* Image Container */}
            <div className="relative pt-8 px-8 flex-center flex-1 min-h-[180px]">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                />
                
                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggle(product.id);
                    }}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    className="absolute top-4 right-4 size-8 rounded-full bg-app-cream flex-center hover:bg-white transition-all shadow-sm active:scale-90"
                >
                    <HeartIcon className={`size-3.5 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : "text-app-text-lighter"}`} />
                </button>
            </div>

            {/* Info Container */}
            <div className="p-6 text-center">
                <h3 className="text-sm font-bold text-app-text line-clamp-1 mb-1 group-hover:text-app-green transition-colors">{product.name}</h3>
                <p className="text-[11px] text-app-text-lighter font-medium mb-3">Local Farmers</p>

                <div className="mb-5">
                    <span className="text-base font-black text-app-text">
                        {currency}{product.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-app-text-lighter font-medium">/ per {product.unit}</span>
                </div>

                <div className="mt-auto">
                    <AnimatePresence mode="wait">
                        {quantity > 0 ? (
                            <motion.div
                                key="stepper"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center justify-between bg-app-green-dark rounded-full p-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                                    title="Decrease quantity"
                                    aria-label="Decrease quantity"
                                    className="size-8 rounded-full flex-center hover:bg-white/10 text-white transition-colors"
                                >
                                    <Minus className="size-3.5" />
                                </button>
                                <span className="text-sm font-bold text-white px-2">{quantity}</span>
                                <button
                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                    title="Increase quantity"
                                    aria-label="Increase quantity"
                                    className="size-8 rounded-full flex-center hover:bg-white/10 text-white transition-colors"
                                >
                                    <Plus className="size-3.5" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="add"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                }}
                                className="w-full py-2.5 bg-app-cream text-app-text text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-app-green hover:text-white transition-all active:scale-[0.98]"
                            >
                                <Plus className="size-3.5" /> Add to Cart
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
