import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchReviews } from "../services/apiService";
import { addReview } from "../services/secureApiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";
import toast from "react-hot-toast";

function StarRating({ rating, setRating, disabled }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        disabled={disabled}
                        className={`text-2xl focus:outline-none transition-colors duration-200 mr-1 ${
                            ratingValue <= (hover || rating)
                                ? "text-yellow-400 hover:text-yellow-500"
                                : "text-gray-300 hover:text-gray-400"
                        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => !disabled && setHover(ratingValue)}
                        onMouseLeave={() => !disabled && setHover(0)}
                        aria-label={`Rate ${ratingValue} stars out of 5`}
                    >
                        ★
                    </button>
                );
            })}
            <span className="ml-2 text-gray-600 text-sm font-medium">
                {rating ? `${rating}/5` : "Select rating"}
            </span>
        </div>
    );
}

function ReviewPage() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false); // New state for submission loading
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [token, setToken] = useRecoilState(tokenAtom);
    const [averageRating, setAverageRating] = useState(0);
    const navigate = useNavigate();

    // Function to fetch reviews and calculate average rating
    const fetchAndSetReviews = async () => {
        try {
            setLoading(true);
            const response = await fetchReviews(id);
            setReviews(response);

            // Calculate average rating
            if (response && response.length > 0) {
                const total = response.reduce(
                    (acc, review) => acc + review.rating,
                    0
                );
                setAverageRating((total / response.length).toFixed(1));
            } else {
                setAverageRating(0);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to load reviews. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndSetReviews();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            toast.error("Please login to add a review");
            navigate("/login");
            return;
        }

        if (rating === 0) {
            toast.error("Please select a rating before submitting");
            return;
        }

        try {
            setSubmitting(true); // Start submission loading
            setToken(storedToken);

            await addReview(id, { reviewText, rating }, storedToken);

            toast.success("Review added successfully");
            setReviewText("");
            setRating(0);

            // Refetch all reviews to ensure we have the complete data with user info
            await fetchAndSetReviews();
        } catch (error) {
            console.error("Error adding review:", error);
            toast.error("Failed to add review. Please try again.");
        } finally {
            setSubmitting(false); // End submission loading
        }
    };

    return (
        <div className="bg-gray-50 py-10 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 md:px-10">
                        <h1 className="text-3xl font-bold text-white">
                            Course Reviews
                        </h1>

                        {!loading && reviews.length > 0 && (
                            <div className="mt-4 flex items-center">
                                <div className="bg-white bg-opacity-20 rounded-lg py-1 px-3 flex items-center">
                                    <span className="text-yellow-300 text-2xl mr-2">
                                        ★
                                    </span>
                                    <span className="text-white font-bold text-xl">
                                        {averageRating}
                                    </span>
                                </div>
                                <span className="text-blue-100 ml-3">
                                    Based on {reviews.length} review
                                    {reviews.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Add Review Form */}
                    <div className="px-6 py-6 md:px-10 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Write a Review
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Your Rating
                                </label>
                                <StarRating
                                    rating={rating}
                                    setRating={setRating}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="mb-5">
                                <label
                                    className="block text-gray-700 text-sm font-medium mb-2"
                                    htmlFor="reviewText"
                                >
                                    Your Review
                                </label>
                                <textarea
                                    id="reviewText"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-700 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Share your experience with this course..."
                                    rows="4"
                                    value={reviewText}
                                    onChange={(e) =>
                                        setReviewText(e.target.value)
                                    }
                                    disabled={submitting}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors duration-300 flex items-center justify-center ${
                                    submitting
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Submit Review
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                    <div className="px-6 py-6 md:px-10">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Student Reviews
                        </h2>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mx-auto text-gray-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                                <p className="text-gray-600 text-lg">
                                    No reviews available for this course yet.
                                </p>
                                <p className="text-gray-500 mt-1">
                                    Be the first to share your experience!
                                </p>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {reviews.map((review) => (
                                    <li
                                        key={review._id}
                                        className="bg-gray-50 rounded-xl p-5 transition-shadow duration-300 hover:shadow-md"
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                                                    {/* Add null check for user and username */}
                                                    {review.user &&
                                                    review.user.username
                                                        ? review.user.username.charAt(
                                                              0
                                                          )
                                                        : "?"}
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex flex-wrap items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        {/* Add null check for user and username */}
                                                        {review.user &&
                                                        review.user.username
                                                            ? review.user
                                                                  .username
                                                            : "Anonymous User"}
                                                    </h3>
                                                    <div className="flex items-center mt-1 md:mt-0">
                                                        <div className="flex">
                                                            {[...Array(5)].map(
                                                                (_, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className={`text-lg ${
                                                                            i <
                                                                            review.rating
                                                                                ? "text-yellow-400"
                                                                                : "text-gray-300"
                                                                        }`}
                                                                    >
                                                                        ★
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            {review.createdAt
                                                                ? new Date(
                                                                      review.createdAt
                                                                  ).toLocaleDateString(
                                                                      "en-US",
                                                                      {
                                                                          year: "numeric",
                                                                          month: "short",
                                                                          day: "numeric",
                                                                      }
                                                                  )
                                                                : "Recent"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-gray-700 whitespace-pre-line">
                                                    {review.reviewText}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewPage;
