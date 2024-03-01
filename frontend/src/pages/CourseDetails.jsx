import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchCourse } from "../services/apiService";
import {
    confirmRazorPayOrder,
    createRazorPayOrder,
    enrollInCourse,
    fetchUserData,
    getRazorPayApi,
} from "../services/secureApiService";
import toast from "react-hot-toast";
import { userState } from "../store/atoms/userState";
import { useRecoilValue } from "recoil";

const API_KEY = import.meta.env.VITE_RAZORPAY_API_KEY;

function CourseDetails() {
    const { id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const userStateValue = useRecoilValue(userState);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetchCourse(id);
                setCourseData(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course:", error);
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="#00BFFF" loading={loading} size={20} />
            </div>
        );
    }
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }
    async function displayRazorpay() {
        if (!userStateValue.isLoggedIn) {
            navigate("/login");
            return;
        }
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // creating a new order
        const result = await createRazorPayOrder({ amount: courseData.price }); // Razorpay expects the amount in paise
        if (!result.success) {
            alert("Server error. Are you online?");
            return;
        }

        const amount = result.order.amount;
        const currency = result.order.currency;
        const order_id = result.order.id;
        const key = await getRazorPayApi();
        const options = {
            key: key,
            amount: amount.toString(),
            currency: currency,
            name: "Knowledge Hive",
            description: "Test Transaction",
            order_id: order_id,
            handler: async function (response) {
                const result = await confirmRazorPayOrder({
                    razorpay_order_id: order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    courseId: courseData._id,
                });
                if (result.success) {
                    toast.success("payment successful");
                    try {
                        await enrollInCourse(courseData._id);
                        toast.success(
                            `successfully enrolled in Course : ${courseData.courseName}`
                        );
                    } catch (error) {
                        toast.error("Error enrolling in course");
                    }
                }
            },
            prefill: {
                name: "Soumya Dey",
                email: "SoumyaDey@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Soumya Dey Corporate Office",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return (
        <div className="bg-gray-100 py-10">
            <div className="container mx-auto flex flex-col sm:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full sm:w-2/3 p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl mb-4 text-gray-800 font-semibold capitalize">
                        {courseData.courseName}
                    </h1>
                    <p className="text-lg mb-6 text-gray-700">
                        {courseData.description}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-700">Instructor:</p>
                            <p
                                className="text-lg text-blue-600 cursor-pointer hover:underline"
                                onClick={() => {
                                    navigate(
                                        `/courses/tutor/${courseData.tutor._id}`
                                    );
                                }}
                            >
                                {courseData.tutor.username}
                            </p>
                        </div>
                        <p className="text-sm text-gray-700">
                            Last Updated:{" "}
                            <span className="text-gray-600">
                                {new Date(
                                    courseData.dateUpdated
                                ).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Syllabus
                        </h2>
                        <ul className="list-disc pl-5">
                            <li>Introduction to the course</li>
                            <li>Module 1: Fundamentals of the topic</li>
                            <li>Module 2: Advanced concepts</li>
                            <li>Module 3: Practical applications</li>
                        </ul>
                    </div>
                </div>

                <div className="w-full sm:w-1/3 bg-gray-200 p-8 flex flex-col items-center justify-center">
                    <div className="mb-6">
                        <img
                            src={courseData.thumbnailUrl}
                            alt={courseData.courseName}
                            className="w-80 h-48 object-cover rounded-lg shadow-md"
                        />
                    </div>
                    <div className="text-lg mb-4">
                        Price : ₹{courseData.price}{" "}
                    </div>
                    <button
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-gray-600"
                        onClick={displayRazorpay}
                    >
                        Enroll Now
                    </button>
                </div>
            </div>

            <div className="container mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 text-center">
                <div className="flex-1">
                    <h2 className="text-xl text-gray-700">Level</h2>
                    <p className="text-2xl text-gray-900 capitalize">
                        {courseData.level}
                    </p>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl text-gray-700">PreRequitites</h2>
                    <p className="text-2xl text-gray-900 capitalize">
                        {courseData.prerequisites}
                    </p>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl text-gray-700">Language</h2>
                    <p className="text-2xl text-gray-900 capitalize">
                        {courseData.language}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;
