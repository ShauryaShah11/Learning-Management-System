import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchReviews } from "../services/apiService";
import { addReview } from "../services/secureApiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";
import toast from "react-hot-toast";

function ReviewPage() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState("");
    const [token, setToken] = useRecoilState(tokenAtom);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetchReviews(id);
                setReviews(response);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };
       fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            toast.error("Please login to add an answer");
            navigate("/login");
            return;
        }

        // Set the token
        setToken(storedToken);
        try {
            await addReview(id, { reviewText, rating }, token);
            setReviewText("");
            setRating(0);
            toast.success("Review added successfully");
        } catch (error) {
            console.error("Error adding review:", error);
            toast.error(`Error adding review: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto my-10 px-4 lg:px-0">
            <div className="bg-gray-100 rounded-lg shadow-lg p-6 lg:p-10 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-600 text-center lg:text-left">
                    Course Reviews
                </h1>
                <div className="mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="reviewText"
                            >
                                Review Text
                            </label>
                            <textarea
                                id="reviewText"
                                className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your review..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="rating"
                            >
                                Rating
                            </label>
                            <input
                                id="rating"
                                type="number"
                                className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your rating (1-5)"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) =>
                                    setRating(parseInt(e.target.value))
                                }
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
                {loading ? (
                    <p className="text-center">Loading reviews...</p>
                ) : (
                    <div>
                        {reviews.length === 0 ? (
                            <p className="text-center">No reviews available for this course.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {reviews.map((review) => (
                                    <li key={review._id} className="py-4">
                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-2 lg:space-y-0 lg:space-x-3">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium">
                                                        {review.user.username}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(
                                                            review.createdAt
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className="text-gray-500 mb-2">
                                                    {review.reviewText}
                                                </p>
                                                <div className="flex items-center">
                                                    {Array(review.rating)
                                                        .fill("★")
                                                        .map((star, index) => (
                                                            <span
                                                                key={index}
                                                                className="text-yellow-400 text-xl"
                                                            >
                                                                {star}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewPage;
