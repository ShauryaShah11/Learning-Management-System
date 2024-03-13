import { useEffect, useState } from "react";
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
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            fetchQuestionData(storedToken);
        } else {
            navigate("/login");
        }
    }, []);

    const submitQuestion = async () => {
        try {
            await addQuestion({ id, questionText: questionInput, token });
            toast.success("Question added successfully");
            await fetchQuestionData();
            setQuestionInput(""); // Clear question input after submission
        } catch (error) {
            console.log(error);
            toast.error("Error adding question");
        }
    };

    const submitAnswer = async (questionId) => {
        try {
            const answerText = answerInputs[questionId];
            await addAnswer(questionId, { answerText }, token );
            toast.success("Answer added successfully");
            await fetchQuestionData();
            // Clear answer input after submission
            setAnswerInputs((prevInputs) => ({
                ...prevInputs,
                [questionId]: ""
            }));
        } catch (error) {
            console.log(error);
            toast.error("Error adding answer");
        }
    };

    const handleAnswerInputChange = (questionId, value) => {
        setAnswerInputs((prevInputs) => ({
            ...prevInputs,
            [questionId]: value,
        }));
    };

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

    useEffect(() => {
        fetchQuestionData();
    }, []);

    return (
        <div className="container mx-auto my-10 p-5 bg-gray-100 rounded shadow-lg max-w-3xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-6">
                    Questions
                </h1>
                <div className="mt-8 mb-8">
                    <input
                        type="text"
                        className="w-full border rounded py-1 px-2"
                        placeholder="Enter your question..."
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded ml-4 mt-2"
                        onClick={submitQuestion}
                    >
                        Add Question
                    </button>
                </div>
                {questions && questions.length > 0 ? (
                    <ul className="space-y-8">
                        {questions.map((question) => (
                            <li key={question._id} className="bg-white rounded shadow">
                                <div className="p-8">
                                    <h2 className="text-2xl font-semibold mb-3">
                                        {question.questionText}
                                    </h2>
                                    <p className="text-gray-700 mb-2">
                                        Asked by: {question.user.username}
                                    </p>
                                    <ul className="list-disc list-inside">
                                        {question.answers.map((answer) => (
                                            <li key={answer._id} className="ml-4 text-gray-700">
                                                {answer.answerText}
                                                <p className="text-xs text-gray-500">
                                                    Answered by: {answer.user.username}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            className="w-full border rounded py-1 px-2"
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
                                            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded ml-4 mt-4"
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
                    <p className="text-gray-700 text-center">No questions to display.</p>
                )}
            </div>
        </div>
    );
}

export default QuestionPage;


