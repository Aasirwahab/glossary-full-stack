import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, SparklesIcon, Trash2Icon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartSidebar = () => {
    const { t } = useTranslation();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const { items, updateQuantity, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const deliveryFee = cartTotal > 20 ? 0 : 1.99;
    const grandTotal = cartTotal + deliveryFee;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-app-border/50">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-app-green-soft flex-center">
                                    <ShoppingBagIcon className="size-5 text-app-green" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-app-text">{t("cart.title")}</h2>
                                    <p className="text-xs text-app-text-lighter">{items.length} {t("cart.items")}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="size-10 rounded-xl hover:bg-zinc-50 flex-center transition-colors">
                                <XIcon className="size-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="size-20 rounded-3xl bg-zinc-50 flex-center mb-5">
                                        <ShoppingBagIcon className="size-9 text-zinc-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-app-text mb-1">{t("cart.empty")}</h3>
                                    <p className="text-sm text-app-text-lighter mb-6">Add items to get started</p>
                                    <button onClick={() => { setIsCartOpen(false); navigate("/products"); }} className="px-6 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-all">
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.product.id}
                                            layout
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 40 }}
                                            className="flex gap-3.5 bg-zinc-50/80 rounded-2xl p-3.5 border border-app-border/30"
                                        >
                                            <img src={item.product.image} alt={item.product.name} className="size-18 rounded-xl object-cover shrink-0 bg-white p-1" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-app-text truncate">{item.product.name}</h4>
                                                <p className="text-xs text-app-text-lighter mt-0.5">
                                                    {currency}{item.product.price.toFixed(2)} / {item.product.unit}
                                                </p>
                                                <div className="flex items-center justify-between mt-2.5">
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="size-7 rounded-lg bg-white border border-app-border/50 flex-center hover:bg-zinc-50 transition-colors active:scale-90">
                                                            <MinusIcon className="size-3 text-zinc-600" />
                                                        </button>
                                                        <span className="text-sm font-semibold w-7 text-center">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="size-7 rounded-lg bg-app-green text-white flex-center hover:bg-app-green-light transition-colors active:scale-90">
                                                            <PlusIcon className="size-3" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="text-sm font-semibold">{currency}{(item.product.price * item.quantity).toFixed(2)}</span>
                                                        <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                            <Trash2Icon className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="px-6 py-5 border-t border-app-border/50 bg-zinc-50/50 space-y-3">
                                {deliveryFee > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl text-xs text-app-orange">
                                        <SparklesIcon className="size-3.5 shrink-0" />
                                        Add {currency}{(20 - cartTotal).toFixed(2)} more for free delivery!
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-app-text-light">{t("cart.subtotal")}</span>
                                    <span className="font-medium">{currency}{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-app-text-light">{t("checkout.delivery")}</span>
                                    <span className="font-medium">{deliveryFee === 0 ? <span className="text-emerald-600">{t("checkout.free")}</span> : `${currency}${deliveryFee.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold border-t border-app-border/50 pt-3">
                                    <span>{t("checkout.total")}</span>
                                    <span>{currency}{grandTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        navigate("/checkout");
                                        window.scrollTo(0, 0);
                                    }}
                                    className="w-full py-3.5 bg-gradient-to-r from-app-orange to-orange-400 text-white font-semibold rounded-xl hover:from-app-orange-dark hover:to-orange-500 transition-all flex-center gap-2 active:scale-[0.98] shadow-lg shadow-orange-500/15"
                                >
                                    {t("cart.checkout")} <ArrowRightIcon className="size-4" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
