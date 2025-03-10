import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchQuestions } from "../services/apiService";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";
import { addAnswer, addQuestion } from "../services/secureApiService";

function QuestionPage() {
    const { id } = useParams();
    const [questions, setQuestions] = useState(null);
    const [questionInput, setQuestionInput] = useState("");
    const [answerInputs, setAnswerInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submittingAnswerId, setSubmittingAnswerId] = useState(null);
    const [token, setToken] = useRecoilState(tokenAtom);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const navigate = useNavigate();

    // Extract the fetchQuestionData logic into a reusable function
    const fetchQuestionData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchQuestions(id);
            setQuestions(response);
            
            // Automatically expand the first question if there's at least one
            // and no question is currently expanded
            if (response && response.length > 0 && !expandedQuestion) {
                setExpandedQuestion(response[0]._id);
            }
        } catch (error) {
            console.error("Error fetching question data:", error);
            toast.error("Could not load questions. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [id, expandedQuestion]);

    // Initial fetch of questions
    useEffect(() => {
        fetchQuestionData();
    }, [fetchQuestionData]);

    const submitQuestion = async () => {
        if (!questionInput.trim()) {
            toast.error("Question cannot be empty");
            return;
        }

        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            toast.error("Please login to ask a question");
            navigate("/login");
            return;
        }

        setToken(storedToken);
        try {
            setSubmitting(true);
            
            // Add the question
            await addQuestion({
                id,
                questionText: questionInput,
                token: storedToken,
            });
            
            toast.success("Question added successfully");
            setQuestionInput(""); // Clear question input after submission
            
            // Refresh all questions to get the updated list
            await fetchQuestionData();
        } catch (error) {
            console.error(error);
            toast.error("Could not add your question. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const submitAnswer = async (questionId) => {
        // Validate answer
        if (
            !answerInputs[questionId] ||
            answerInputs[questionId].trim() === ""
        ) {
            toast.error("Answer cannot be empty");
            return;
        }

        // Retrieve the token from localStorage
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            toast.error("Please login to add an answer");
            navigate("/login");
            return;
        }

        // Set the token
        setToken(storedToken);

        try {
            setSubmittingAnswerId(questionId);
            
            // Get the answer text for the specific question
            const answerText = answerInputs[questionId];

            // Submit the answer
            await addAnswer(
                questionId,
                { answerText },
                storedToken
            );

            toast.success("Answer added successfully");

            // Clear the answer input after submission
            setAnswerInputs((prevInputs) => ({
                ...prevInputs,
                [questionId]: "",
            }));
            
            // Refresh all questions to get the updated list
            await fetchQuestionData();
        } catch (error) {
            console.error("Error adding answer:", error);
            toast.error("Could not add your answer. Please try again.");
        } finally {
            setSubmittingAnswerId(null);
        }
    };

    const handleAnswerInputChange = (questionId, value) => {
        setAnswerInputs((prevInputs) => ({
            ...prevInputs,
            [questionId]: value,
        }));
    };

    const toggleExpandQuestion = (questionId) => {
        setExpandedQuestion((prev) =>
            prev === questionId ? null : questionId
        );
    };

    // Format date to a readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Helper to safely get first letter of username
    const getFirstLetter = (user) => {
        return user && user.username
            ? user.username.charAt(0).toUpperCase()
            : "?";
    };

    // Helper to safely get username
    const getUsername = (user) => {
        return user && user.username ? user.username : "Anonymous User";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
                        <h1 className="text-3xl font-bold text-white">
                            Discussion Forum
                        </h1>
                        <p className="text-indigo-100 mt-2">
                            Ask questions, share knowledge, and connect with
                            other students
                        </p>
                    </div>

                    {/* Ask Question Form */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Ask a New Question
                        </h2>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <textarea
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    submitting ? 'bg-gray-100' : 'bg-white'
                                } border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none`}
                                placeholder="What would you like to ask?"
                                value={questionInput}
                                onChange={(e) =>
                                    setQuestionInput(e.target.value)
                                }
                                rows="3"
                                disabled={submitting}
                            ></textarea>
                            <div className="flex justify-end mt-3">
                                <button
                                    className={`px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-300 flex items-center ${
                                        submitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                    onClick={submitQuestion}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                            Post Question
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {loading
                                ? "Loading questions..."
                                : questions && questions.length > 0
                                ? `${questions.length} Question${
                                      questions.length !== 1 ? "s" : ""
                                  }`
                                : "No questions yet"}
                        </h2>
                        
                        {/* Refresh button */}
                        {!loading && (
                            <button 
                                onClick={fetchQuestionData}
                                className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                title="Refresh questions"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : !questions || questions.length === 0 ? (
                        <div className="text-center py-16 px-6">
                            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-10 h-10 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No questions yet
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                Be the first to ask a question about this
                                course. Your question might help others too!
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {questions.map((question) => (
                                <li
                                    key={question._id}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <div className="px-6 py-5">
                                        {/* Question Header */}
                                        <div
                                            className="flex items-start cursor-pointer"
                                            onClick={() =>
                                                toggleExpandQuestion(
                                                    question._id
                                                )
                                            }
                                        >
                                            {/* User Avatar - Fixed with null check */}
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {getFirstLetter(
                                                        question.user
                                                    )}
                                                </div>
                                            </div>

                                            {/* Question Content */}
                                            <div className="flex-grow">
                                                <div className="flex items-center mb-1">
                                                    <span className="font-medium text-gray-900 mr-2">
                                                        {getUsername(
                                                            question.user
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {question.createdAt &&
                                                            formatDate(
                                                                question.createdAt
                                                            )}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {question.questionText}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span className="flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                                            ></path>
                                                        </svg>
                                                        {
                                                            question.answers
                                                                .length
                                                        }{" "}
                                                        {question.answers
                                                            .length === 1
                                                            ? "answer"
                                                            : "answers"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Expand/Collapse Icon */}
                                            <div className="ml-4 flex-shrink-0">
                                                <div
                                                    className={`transform transition-transform duration-200 ${
                                                        expandedQuestion ===
                                                        question._id
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-gray-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Content - Answers & Reply Form */}
                                        {expandedQuestion === question._id && (
                                            <div className="mt-4 pl-14">
                                                {/* Answers List */}
                                                {question.answers &&
                                                question.answers.length > 0 ? (
                                                    <div className="mb-6 space-y-4">
                                                        {question.answers.map(
                                                            (answer) => (
                                                                <div
                                                                    key={
                                                                        answer._id
                                                                    }
                                                                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                                                >
                                                                    <div className="flex items-start">
                                                                        {/* Answer User Avatar - Fixed with null check */}
                                                                        <div className="flex-shrink-0 mr-3">
                                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                                {getFirstLetter(
                                                                                    answer.user
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Answer Content */}
                                                                        <div className="flex-grow">
                                                                            <div className="flex items-center mb-1">
                                                                                <span className="font-medium text-gray-900 text-sm mr-2">
                                                                                    {getUsername(
                                                                                        answer.user
                                                                                    )}
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {answer.createdAt &&
                                                                                        formatDate(
                                                                                            answer.createdAt
                                                                                        )}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-gray-800">
                                                                                {
                                                                                    answer.answerText
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4 mb-4 bg-gray-50 rounded-lg">
                                                        <p className="text-gray-500 text-sm">
                                                            No answers yet. Be
                                                            the first to
                                                            respond!
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Answer Form */}
                                                <div className="relative">
                                                    <textarea
                                                        className={`w-full rounded-lg border ${
                                                            submittingAnswerId === question._id ? 'bg-gray-100' : 'bg-white'
                                                        } border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors px-4 py-2 resize-none`}
                                                        placeholder="Write your answer..."
                                                        value={
                                                            answerInputs[
                                                                question._id
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleAnswerInputChange(
                                                                question._id,
                                                                e.target.value
                                                            )
                                                        }
                                                        rows="2"
                                                        disabled={
                                                            submittingAnswerId ===
                                                            question._id
                                                        }
                                                    ></textarea>
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-300 flex items-center ${
                                                                submittingAnswerId === question._id ? 'opacity-70 cursor-not-allowed' : ''
                                                            }`}
                                                            onClick={() =>
                                                                submitAnswer(
                                                                    question._id
                                                                )
                                                            }
                                                            disabled={
                                                                submittingAnswerId ===
                                                                question._id
                                                            }
                                                        >
                                                            {submittingAnswerId ===
                                                            question._id ? (
                                                                <>
                                                                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                                                                    Posting...
                                                                </>
                                                            ) : (
                                                                "Post Answer"
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionPage;