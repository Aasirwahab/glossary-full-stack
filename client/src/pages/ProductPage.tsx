import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { Product } from "../types";
import Loading from "../components/Loading";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, HeartIcon, HomeIcon, LeafIcon, MinusIcon, PlusIcon, ShieldCheckIcon, ShoppingCartIcon, StarIcon, TruckIcon } from "lucide-react";
import ReviewSection from "../components/ReviewSection";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import api from "../config/api";
import { motion } from "framer-motion";

const ProductPage = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const { id } = useParams();
    const navigate = useNavigate();
    const { items, addToCart, updateQuantity, removeFromCart } = useCart();
    const { wishlistIds, toggle } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [localQuantity, setLocalQuantity] = useState(1);

    useEffect(() => {
        setLoading(true);
        setLocalQuantity(1);
        window.scrollTo(0, 0);

        api.get(`/products/${id}`)
            .then(({ data }) => {
                setProduct(data.product);
                return api.get(`/products?category=${data.product.category}`);
            })
            .then(({ data }) => {
                setRelatedProducts(data.products.filter((p: Product) => p.id !== id));
            })
            .catch(() => navigate("/products"))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return <Loading />;
    if (!product) return null;

    const cartItem = items.find((item) => item.product.id === product.id);
    const inCart = !!cartItem;
    const displayQuantity = inCart ? cartItem.quantity : localQuantity;

    const handleMinus = () => {
        if (inCart) {
            if (cartItem.quantity > 1) updateQuantity(product.id, cartItem.quantity - 1);
            else removeFromCart(product.id);
        } else {
            setLocalQuantity(Math.max(1, localQuantity - 1));
        }
    };

    const handlePlus = () => {
        if (inCart) updateQuantity(product.id, cartItem.quantity + 1);
        else setLocalQuantity(localQuantity + 1);
    };

    const categoryLabel = product.category.replace(/-/g, " ");

    return (
        <div className="min-h-screen pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-app-text-lighter mb-6">
                    <Link to="/" className="hover:text-app-green transition-colors"><HomeIcon className="size-4" /></Link>
                    <span className="text-app-border">/</span>
                    <Link to="/products" className="hover:text-app-green transition-colors">Products</Link>
                    <span className="text-app-border">/</span>
                    <Link to={`/products?category=${product.category}`} className="hover:text-app-green transition-colors capitalize">{categoryLabel}</Link>
                    <span className="text-app-border">/</span>
                    <span className="text-app-text font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>

                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-app-text-lighter hover:text-app-green transition-colors">
                    <ArrowLeftIcon className="size-4" /> Back
                </button>

                {/* Product Details */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl overflow-hidden shadow-soft border border-app-border/30">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image */}
                        <div className="relative flex-center p-10 md:p-16 min-h-[320px] md:min-h-[480px] bg-gradient-to-br from-zinc-50 to-zinc-100/50">
                            <img src={product.image} alt={product.name} className="max-h-[360px] w-auto object-contain drop-shadow-sm" />

                            <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
                                {product.isOrganic && (
                                    <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-500 text-white rounded-lg shadow-sm">
                                        <LeafIcon className="size-3" /> Organic
                                    </span>
                                )}
                                {product.discount > 0 && (
                                    <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-sm">
                                        {product.discount}% OFF
                                    </span>
                                )}
                            </div>

                            <button onClick={() => toggle(product.id)} className="absolute top-5 right-5 size-11 rounded-xl bg-white/90 backdrop-blur-sm flex-center hover:bg-white transition-all shadow-sm hover:shadow-md active:scale-90">
                                <HeartIcon className={`size-5 transition-colors ${wishlistIds.has(product.id) ? "text-red-500 fill-red-500" : "text-zinc-400"}`} />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <span className="text-xs font-semibold text-app-text-lighter uppercase tracking-wider mb-2 capitalize">{categoryLabel}</span>

                            <h1 className="text-2xl md:text-3xl font-semibold text-app-text mb-3">{product.name}</h1>

                            {/* Rating */}
                            {product.rating > 0 && (
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="flex items-center gap-0.5 px-2.5 py-1 bg-amber-50 rounded-lg">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon key={star} className={`size-4 ${star <= Math.round(product.rating) ? "text-amber-500 fill-amber-500" : "text-zinc-200"}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-amber-700">{product.rating}</span>
                                    <span className="text-sm text-app-text-lighter">({product.reviewCount} reviews)</span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-5">
                                <span className="text-3xl md:text-4xl font-bold text-app-text">{currency}{product.price.toFixed(2)}</span>
                                {product.originalPrice > product.price && (
                                    <span className="text-lg text-app-text-lighter line-through">{currency}{product.originalPrice.toFixed(2)}</span>
                                )}
                                {product.discount > 0 && (
                                    <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg">Save {currency}{(product.originalPrice - product.price).toFixed(2)}</span>
                                )}
                            </div>

                            <p className="text-sm text-app-text-light leading-relaxed mb-6">{product.description}</p>

                            {/* Stock */}
                            <div className="mb-6">
                                {product.stock > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">
                                        <CheckIcon className="size-3.5" /> In Stock ({product.stock} available)
                                    </span>
                                ) : (
                                    <span className="text-sm text-red-500 font-medium bg-red-50 px-3 py-1.5 rounded-lg">Out of Stock</span>
                                )}
                            </div>

                            {/* Quantity + Add to Cart */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center border border-app-border/50 rounded-xl overflow-hidden bg-zinc-50">
                                    <button onClick={handleMinus} className="p-3.5 hover:bg-zinc-100 transition-colors active:scale-90">
                                        <MinusIcon className="size-4 text-zinc-600" />
                                    </button>
                                    <span className="px-5 text-sm font-semibold min-w-[40px] text-center">{displayQuantity}</span>
                                    <button onClick={handlePlus} className="p-3.5 hover:bg-zinc-100 transition-colors active:scale-90">
                                        <PlusIcon className="size-4 text-zinc-600" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => { if (!inCart) addToCart(product, localQuantity); }}
                                    disabled={product.stock === 0}
                                    className={`flex-1 py-3.5 font-semibold rounded-xl transition-all flex-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${
                                        inCart
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-gradient-to-r from-app-orange to-orange-400 text-white hover:from-app-orange-dark hover:to-orange-500 shadow-lg shadow-orange-500/15"
                                    }`}
                                >
                                    {inCart ? <><CheckIcon className="size-4" /> Added to Cart</> : <><ShoppingCartIcon className="size-4" /> Add to Cart</>}
                                </button>
                            </div>

                            {/* Trust signals */}
                            <div className="flex items-center gap-4 pt-5 border-t border-app-border/30">
                                <div className="flex items-center gap-2 text-xs text-app-text-lighter">
                                    <TruckIcon className="size-4 text-app-green" /> Free delivery on $20+
                                </div>
                                <div className="flex items-center gap-2 text-xs text-app-text-lighter">
                                    <ShieldCheckIcon className="size-4 text-app-green" /> Secure checkout
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Reviews */}
                <ReviewSection product={product} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-12 mb-20">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-app-text">Related Products</h2>
                                <p className="text-sm text-app-text-lighter mt-1.5">More from {categoryLabel}</p>
                            </div>
                            <Link className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors" to={`/products?category=${product.category}`}>
                                View All <ArrowRightIcon className="size-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
                            {relatedProducts.slice(0, 5).map((rp) => <ProductCard key={rp.id} product={rp} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
