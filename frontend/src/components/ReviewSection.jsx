import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ReviewSection = ({ userId, transactionId, isReviewable }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get(`/reviews/user/${userId}`);
                setReviews(data.reviews);
                setStats(data.stats);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        };
        fetchReviews();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/reviews', {
                targetId: userId,
                transactionId,
                rating: newReview.rating,
                comment: newReview.comment
            });
            toast.success("Review submitted successfully!");
            setNewReview({ rating: 5, comment: '' });
            // Refresh reviews
            const { data } = await api.get(`/reviews/user/${userId}`);
            setReviews(data.reviews);
            setStats(data.stats);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="text-orange-500" /> User Reviews
                    </h3>
                    <p className="text-gray-500 mt-1">What others say about this user</p>
                </div>

                <div className="flex items-center gap-4 bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
                    <div className="flex text-orange-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} fill={i < Math.round(stats.averageRating) ? "currentColor" : "none"} className="w-5 h-5" />
                        ))}
                    </div>
                    <span className="text-2xl font-black text-gray-900">{stats.averageRating.toFixed(1)}</span>
                    <span className="text-orange-600 font-semibold text-sm">({stats.totalReviews} Reviews)</span>
                </div>
            </div>

            {isReviewable && (
                <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">Write a Review</h4>
                    <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className={`${newReview.rating >= star ? 'text-orange-500' : 'text-gray-300'} transition-colors`}
                            >
                                <Star fill={newReview.rating >= star ? "currentColor" : "none"} className="w-8 h-8" />
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all mb-4"
                        placeholder="Share your experience..."
                        rows="3"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                    ></textarea>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Review</>}
                    </button>
                </form>
            )}

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 italic">No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-gray-900">{review.reviewer?.name}</span>
                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex text-orange-400 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} fill={i < review.rating ? "currentColor" : "none"} className="w-3 h-3" />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
