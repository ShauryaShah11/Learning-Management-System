import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchCourse, getRazorPayApi } from "../services/apiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";
import toast from "react-hot-toast";
import {
    confirmRazorPayOrder,
    createRazorPayOrder,
    enrollInCourse,
    fetchMyCourses,
    fetchUserData,
} from "../services/secureApiService";
import { userState } from "../store/atoms/userState";
import { userAtom } from "../store/atoms/userAtom";

function CourseDetails() {
    const { id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [userCourses, setUserCourses] = useState([]);
    const [userData, setUserData] = useRecoilState(userAtom);
    const [token, setToken] = useRecoilState(tokenAtom); // Read token from state
    const [userStateValue, setUserStateValue] = useRecoilState(userState);
    const [activeTab, setActiveTab] = useState("overview"); // For tabbed navigation
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseResponse = await fetchCourse(id);
                setCourseData(courseResponse);
            } catch (error) {
                console.error("Error fetching course:", error);
                toast.error("Failed to load course details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!token) return; // Only fetch courses if token exists

        const fetchUserCourses = async () => {
            try {
                const userCoursesResponse = await fetchMyCourses(token);
                const courses = userCoursesResponse.map(
                    (enrollment) => enrollment.course
                );
                setUserCourses(courses);
            } catch (error) {
                console.error("Error fetching user courses:", error);
            }
        };

        fetchUserCourses();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader color="#4F46E5" loading={loading} size={40} />
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
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
            toast.error("You must be logged in to purchase a course");
            navigate("/login");
            return;
        }

        setToken(storedToken);
        const userResponse = await fetchUserData(storedToken);
        setUserData(userResponse);

        if (!userStateValue.isLoggedIn || !userResponse || !storedToken) {
            toast.error("You must be logged in to purchase a course");
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

        try {
            const result = await createRazorPayOrder({
                amount: courseData.price,
                token: storedToken,
            });

            if (!result.success) {
                alert("Server error. Are you online?");
                return;
            }

            // The order amount should already be in paisa from your backend
            const order_id = result.order.id;
            const currency = result.order.currency;
            const key = await getRazorPayApi();

            const options = {
                key,
                amount: 100, // This is already in paisa
                currency,
                name: "Knowledge Hive",
                description: `Payment for ${courseData.courseName}`,
                order_id,
                handler: async function (response) {
                    try {
                        const result = await confirmRazorPayOrder({
                            razorpay_order_id: order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: courseData._id,
                            token: storedToken,
                        });

                        if (result.success) {
                            toast.success("Payment successful");
                            try {
                                await enrollInCourse(
                                    courseData._id,
                                    storedToken
                                );
                                toast.success(
                                    `Successfully enrolled in Course: ${courseData.courseName}`
                                );
                                // Refresh the user courses
                                const userCoursesResponse =
                                    await fetchMyCourses(storedToken);
                                const courses = userCoursesResponse.map(
                                    (enrollment) => enrollment.course
                                );
                                setUserCourses(courses);
                            } catch (error) {
                                toast.error("Error enrolling in course");
                            }
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (error) {
                        toast.error("Error processing payment");
                    }
                },
                prefill: {
                    name: userResponse.username || "",
                    email: userResponse.email || "",
                    contact: userResponse.contactNumber || "",
                },
                notes: {
                    address: "Knowledge Hive Office",
                    course_id: courseData._id,
                    course_name: courseData.courseName,
                },
                theme: {
                    color: "#4F46E5", // Indigo-600
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Razorpay error:", error);
            toast.error("Error creating payment order");
        }
    }

    const isUserEnrolled = userCourses.some(
        (course) => course._id === courseData._id
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            {/* Hero Section with Course Image and Title */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                <div className="container mx-auto px-4 py-12 md:py-20">
                    <div className="flex flex-col md:flex-row md:items-center">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 capitalize">
                                {courseData.courseName}
                            </h1>
                            <p className="text-lg text-indigo-100 mb-6 max-w-2xl">
                                {courseData.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm md:text-base">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    <span>Level: {courseData.level}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                                    </svg>
                                    <span>Language: {courseData.language}</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 md:pl-12 flex justify-center md:justify-end">
                            <div className="w-full max-w-md relative">
                                <img
                                    src={courseData.thumbnailUrl}
                                    alt={courseData.courseName}
                                    className="w-full h-64 object-cover rounded-lg shadow-xl"
                                />
                                <div className="absolute inset-0 rounded-lg shadow-inner bg-black bg-opacity-10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Sticky Enrollment Card */}
                <div className="relative mt-[-60px] mb-8 z-10">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden mx-auto max-w-4xl">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="flex-grow p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to start learning?</h2>
                                <div className="flex items-center mb-4">
                                    <div className="text-3xl font-bold text-indigo-600 mr-3">₹{courseData.price || 0}</div>
                                    {courseData.originalPrice && courseData.originalPrice > courseData.price && (
                                        <div className="text-lg text-gray-500 line-through">₹{courseData.originalPrice}</div>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 mb-2">
                                    Access to all course material and future updates
                                </div>
                            </div>
                            <div className="w-full md:w-auto p-6 md:p-8">
                                {isUserEnrolled ? (
                                    <div className="flex flex-col items-center">
                                        <div className="bg-green-100 text-green-800 font-medium py-2 px-4 rounded-md flex items-center mb-3">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Enrolled
                                        </div>
                                        <button
                                            onClick={() => navigate(`/courses`)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow transition-colors duration-300"
                                        >
                                            Continue Learning
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow transition-colors duration-300 flex items-center justify-center"
                                        onClick={() => {
                                            if (!token) {
                                                toast.error("Please login to enroll");
                                                navigate("/login");
                                            } else {
                                                toast.success("Processing payment");
                                                displayRazorpay();
                                            }
                                        }}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                                        </svg>
                                        Enroll Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content Tabs */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 mx-auto max-w-4xl">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`py-4 px-6 font-medium text-sm md:text-base flex-1 text-center border-b-2 ${
                                    activeTab === "overview"
                                        ? "border-indigo-500 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("details")}
                                className={`py-4 px-6 font-medium text-sm md:text-base flex-1 text-center border-b-2 ${
                                    activeTab === "details"
                                        ? "border-indigo-500 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Course Details
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 md:p-8">
                        {activeTab === "overview" && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        {courseData.description}
                                    </p>
                                    
                                    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">What you'll learn</h3>
                                    <ul className="space-y-2">
                                        {courseData.outcomes && courseData.outcomes.split(',').map((outcome, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span>{outcome.trim()}</span>
                                            </li>
                                        ))}
                                        {!courseData.outcomes && (
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span>Complete skills in {courseData.courseName}</span>
                                            </li>
                                        )}
                                    </ul>

                                    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">Prerequisites</h3>
                                    <p className="text-gray-700 mb-4">
                                        {courseData.prerequisites || "No specific prerequisites required for this course."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === "details" && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Details</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                            Course Level
                                        </h3>
                                        <p className="text-gray-700">{courseData.level || "All Levels"}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                                            </svg>
                                            Language
                                        </h3>
                                        <p className="text-gray-700">{courseData.language || "English"}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            Duration
                                        </h3>
                                        <p className="text-gray-700">{courseData.duration || "Self-paced"}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                            </svg>
                                            Certificate
                                        </h3>
                                        <p className="text-gray-700">Certificate of completion</p>
                                    </div>
                                </div>

                                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                        </svg>
                                        Course Curriculum
                                    </h3>
                                    
                                    {courseData.syllabus ? (
                                        <div className="text-gray-700">
                                            {courseData.syllabus}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 italic">
                                            Enroll to see the complete curriculum
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;