import { useEffect, useState } from "react";
import { Loader2Icon, StarIcon, Trash2Icon } from "lucide-react";
import type { Product, Review } from "../types";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";

export default function ReviewSection({ product }: { product: Product }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Review form
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const userHasReviewed = user ? reviews.some((r) => r.user.id === user.id) : false;

    useEffect(() => {
        api.get(`/products/${product.id}/reviews`)
            .then(({ data }) => setReviews(data.reviews))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [product.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        setSubmitting(true);
        try {
            const { data } = await api.post(`/products/${product.id}/reviews`, { rating, comment });
            setReviews([data.review, ...reviews]);
            setRating(0);
            setComment("");
            setShowForm(false);
            toast.success("Review submitted!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        try {
            await api.delete(`/products/${product.id}/reviews/${reviewId}`);
            setReviews(reviews.filter((r) => r.id !== reviewId));
            toast.success("Review deleted");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    // Rating breakdown from real reviews
    const breakdown = [0, 0, 0, 0, 0];
    reviews.forEach((r) => breakdown[r.rating - 1]++);
    breakdown.reverse(); // 5→1
    const maxCount = Math.max(...breakdown, 1);
    const avgRating = reviews.length > 0 ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 : 0;

    if (loading) {
        return (
            <section className="mt-10">
                <h2 className="text-2xl font-semibold text-app-green mb-6">Customer Reviews</h2>
                <div className="flex-center py-12">
                    <Loader2Icon className="size-6 animate-spin text-app-text-light" />
                </div>
            </section>
        );
    }

    return (
        <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-app-green">Customer Reviews</h2>
                {user && !userHasReviewed && !showForm && (
                    <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors">
                        Write a Review
                    </button>
                )}
            </div>

            <div className="bg-white/50 rounded-2xl p-6 md:p-8">
                {/* Review Form */}
                {showForm && (
                    <div className="mb-8 pb-8 border-b border-app-border">
                        <h3 className="text-lg font-semibold text-app-green mb-4">Write Your Review</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Star Rating Picker */}
                            <div>
                                <label className="block text-sm font-medium text-app-green mb-2">Rating</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-0.5"
                                        >
                                            <StarIcon
                                                className={`size-7 transition-colors ${
                                                    star <= (hoverRating || rating) ? "text-app-warning fill-app-warning" : "text-app-border"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    {rating > 0 && <span className="text-sm text-app-text-light ml-2">{rating}/5</span>}
                                </div>
                            </div>
                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-app-green mb-1.5">Comment (optional)</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                    placeholder="Share your experience with this product..."
                                    className="w-full px-4 py-2.5 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting || rating === 0}
                                    className="px-6 py-2.5 bg-app-green text-white text-sm font-semibold rounded-xl hover:bg-app-green-light transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <Loader2Icon className="size-4 animate-spin" />}
                                    Submit Review
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setRating(0);
                                        setComment("");
                                    }}
                                    className="px-6 py-2.5 text-sm font-semibold text-app-text-light hover:text-app-green transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-app-text-light">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    <>
                        {/* Summary row */}
                        <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-app-border">
                            <div className="flex-center flex-col md:min-w-[160px] lg:w-1/3">
                                <span className="text-5xl font-semibold text-app-green">{avgRating}</span>
                                <div className="flex items-center gap-0.5 mt-2 mb-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <StarIcon key={s} className={`size-4 ${s <= Math.round(avgRating) ? "text-app-warning fill-app-warning" : "text-app-border"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-zinc-600">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                            </div>

                            <div className="flex-1 space-y-2">
                                {breakdown.map((count, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-sm text-zinc-600 w-8 text-right">{5 - i} ★</span>
                                        <div className="flex-1 h-2.5 bg-app-border rounded-full overflow-hidden">
                                            <div className="h-full bg-app-warning rounded-full transition-all duration-500" style={{ width: `${(count / maxCount) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-zinc-600 w-6">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Individual reviews */}
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="flex gap-4">
                                    <div className="size-10 rounded-full bg-app-green/10 text-app-green flex-center shrink-0 text-sm font-semibold">
                                        {review.user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                            <span className="text-sm font-semibold text-app-text">{review.user.name}</span>
                                            <span className="text-xs text-zinc-600">·</span>
                                            <span className="text-xs text-zinc-600">
                                                {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </span>
                                            {user?.id === review.user.id && (
                                                <button onClick={() => handleDelete(review.id)} className="ml-auto text-app-text-light hover:text-red-500 transition-colors" title="Delete review">
                                                    <Trash2Icon className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-0.5 mb-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <StarIcon key={s} className={`size-3.5 ${s <= review.rating ? "text-app-warning fill-app-warning" : "text-app-border"}`} />
                                            ))}
                                        </div>
                                        {review.comment && <p className="text-sm text-zinc-600 leading-relaxed">{review.comment}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
