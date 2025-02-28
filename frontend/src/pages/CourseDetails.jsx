import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchCourse } from "../services/apiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";
import toast from "react-hot-toast";
import { fetchMyCourses } from "../services/secureApiService";

function CourseDetails() {
    const { id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [userCourses, setUserCourses] = useState([]);
    const [token] = useRecoilState(tokenAtom); // Read token from state
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseResponse = await fetchCourse(id);
                setCourseData(courseResponse);
            } catch (error) {
                console.error("Error fetching course:", error);
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
                const courses = userCoursesResponse.map((enrollment) => enrollment.course);
                setUserCourses(courses);
            } catch (error) {
                console.error("Error fetching user courses:", error);
            }
        };

        fetchUserCourses();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="#61dafb" loading={loading} size={20} />
            </div>
        );
    }

    const isUserEnrolled = userCourses.some(course => course._id === courseData._id);

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
                                Price: ₹{courseData.price}
                            </div>
                            {isUserEnrolled ? (
                                <div className="text-green-600 font-semibold">
                                    You are already enrolled in this course
                                </div>
                            ) : (
                                <button
                                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-gray-600"
                                    onClick={() => toast.success("Redirecting to payment")}
                                >
                                    Enroll Now
                                </button>
                            )}
                        </div>
                        <div className="w-full lg:w-2/3 p-4">
                            <h1 className="text-xl text-gray-800 font-semibold sm:text-2xl mb-4 capitalize">
                                {courseData.courseName}
                            </h1>
                            <p className="text-md text-gray-800 sm:text-lg mb-6">
                                {courseData.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;
