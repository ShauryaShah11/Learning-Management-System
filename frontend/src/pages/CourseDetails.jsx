import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchCourse, getRazorPayApi } from "../services/apiService";
import {
    confirmRazorPayOrder,
    createRazorPayOrder,
    enrollInCourse,
    fetchUserData,
} from "../services/secureApiService";
import toast from "react-hot-toast";
import { userState } from "../store/atoms/userState";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";
import { userAtom } from "../store/atoms/userAtom";

function CourseDetails({ isPurchased }) {
    const { id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useRecoilState(userAtom);
    const [token, setToken] = useRecoilState(tokenAtom);
    const [userStateValue, setUserStateValue] = useRecoilState(userState);

    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchData = async () => {
            try {
                const courseResponse = await fetchCourse(id);
                setCourseData(courseResponse);
                setLoading(false);
               
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="#61dafb" loading={loading} size={40} />
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
    
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    
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
    
            const amount = result.order.amount / 100; // Convert back to rupees
            const currency = result.order.currency;
            const order_id = result.order.id;
            const key = await getRazorPayApi();
    
            const options = {
                key,
                amount: result.order.amount.toString(),
                currency,
                name: "Knowledge Hive",
                description: "Test Transaction",
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
                                await enrollInCourse(courseData._id, storedToken);
                                toast.success(
                                    `Successfully enrolled in Course: ${courseData.courseName}`
                                );
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
                    name: userResponse.username,
                    email: userResponse.email,
                    contact: userResponse.contactNumber,
                },
                notes: {
                    address: "Knowledge Hive Office",
                },
                theme: {
                    color: "#61dafb",
                },
            };
    
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            toast.error("Error creating Razorpay order");
        }
    }
    

    return (
        <div className="bg-gray-100 p-4">
            <div className="container mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="w-full lg:w-1/3 bg-gray-200 p-8 flex flex-col items-center justify-center">
                            <div className="mb-6">
                                <img
                                    src={courseData.thumbnailUrl}
                                    alt={courseData.courseName}
                                    className="w-full h-48 object-cover rounded-lg shadow-md"
                                />
                            </div>
                            <div className="text-lg mb-4">
                                Price: ₹{courseData.price}{" "}
                            </div>
                            {isPurchased ? (
                                <div>{/* Display course content */}</div>
                            ) : (
                                <button
                                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-gray-600"
                                    onClick={displayRazorpay}
                                >
                                    Enroll Now
                                </button>
                            )}
                        </div>
                        <div className="w-full lg:w-2/3 p-4">
                            <h1 className="text-xl text-gray-800 font-semibold sm:text-2xl mb-4 text-gray-800 font-semibold capitalize">
                                {courseData.courseName}
                            </h1>
                            <p className="text-md text-gray-800 sm:text-lg mb-6 text-gray-700">
                                {courseData.description}
                            </p>
                            <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
                                <div className="mb-4 lg:mb-0">
                                    <p className="text-sm text-gray-700">
                                        Instructor:
                                    </p>
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
                                            courseData.updatedAt
                                        ).toLocaleDateString()}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details Section */}
                    <div className="p-6 bg-white rounded-lg shadow-lg mt-6">
                        <h2 className="text-xl text-gray-800 sm:text-2xl text-gray-800 font-semibold mb-4">
                            Course Details
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                                <p className="text-md text-gray-800 sm:text-lg text-gray-700">
                                    Level:{" "}
                                    <span className="font-medium text-gray-900">
                                        {courseData.level}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-md text-gray-800 sm:text-lg text-gray-700">
                                    Prerequisites:{" "}
                                    <span className="font-medium text-gray-900">
                                        {courseData.prerequisites}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-md text-gray-800 sm:text-lg text-gray-700">
                                    Language:{" "}
                                    <span className="font-medium text-gray-900">
                                        {courseData.language}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;
