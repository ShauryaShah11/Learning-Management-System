import React, { useEffect, useState } from "react";
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
    const [token, setToken] = useRecoilState(tokenAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                setLoading(true);
                const response = await fetchQuestions(id);
                setQuestions(response);
            } catch (error) {
                console.error("Error fetching question data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionData();

    }, [id]);

    const submitQuestion = async () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            toast.error("Please login to add an answer");
            navigate("/login");
            return;
        }

        // Set the token
        setToken(storedToken);
        try {
            await addQuestion({ id, questionText: questionInput, token });
            toast.success("Question added successfully");
            setQuestionInput(""); // Clear question input after submission
        } catch (error) {
            console.log(error);
            toast.error("Error adding question");
        }
    };

    const submitAnswer = async (questionId) => {
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
            // Get the answer text for the specific question
            const answerText = answerInputs[questionId];
    
            // Validate that the answer is not empty
            if (!answerText || answerText.trim() === "") {
                toast.error("Answer cannot be empty");
                return;
            }
    
            // Submit the answer
            await addAnswer(questionId, { answerText }, storedToken);
            toast.success("Answer added successfully");
    
            // Clear the answer input after submission
            setAnswerInputs((prevInputs) => ({
                ...prevInputs,
                [questionId]: ""
            }));
        } catch (error) {
            console.error("Error adding answer:", error);
            toast.error("Error adding answer");
        }
    };
    

    const handleAnswerInputChange = (questionId, value) => {
        setAnswerInputs((prevInputs) => ({
            ...prevInputs,
            [questionId]: value,
        }));
    };

    return (
        <div className="container mx-auto my-10 p-5 bg-gray-100 rounded shadow-lg max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-600 mb-6 text-center lg:text-left">
                    Questions
                </h1>
                <div className="mt-8">
                    <input
                        type="text"
                        className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your question..."
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                    />
                    <button
                        className="bg-gray-500 hover:bg-gray- mt-4 text-white py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
                        onClick={submitQuestion}
                    >
                        Add Question
                    </button>
                </div>
                {questions && questions.length > 0 ? (
                    <ul className="mt-8 space-y-8">
                        {questions.map((question) => (
                            <li key={question._id} className="bg-white rounded shadow-lg">
                                <div className="p-6 lg:p-8">
                                    <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
                                        {question.questionText}
                                    </h2>
                                    <p className="text-gray-600 mb-2">
                                        Asked by: {question.user.username}
                                    </p>
                                    <ul className="space-y-4">
                                        {question.answers.map((answer) => (
                                            <li key={answer._id} className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${answer.user.username}&background=random`}
                                                        alt={`${answer.user.username}'s avatar`}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-gray-700">
                                                        {answer.answerText}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Answered by: {answer.user.username}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter your answer..."
                                            value={answerInputs[question._id] || ""}
                                            onChange={(e) =>
                                                handleAnswerInputChange(
                                                    question._id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            className="bg-gray-500 hover:bg-gray-700 mt-4 text-white py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
                                            onClick={() => submitAnswer(question._id)}
                                        >
                                            Add Answer
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-700 text-center mt-8">No questions to display.</p>
                )}
            </div>
        </div>
    );
}

export default QuestionPage;
