import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourseContent, fetchMyCourses } from "../services/secureApiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import FirstBox from "../components/FirstBox";
import Subsection from "../components/Subsection";

function CourseContent() {
    const { id } = useParams();
    const [showCourseContent, setShowCourseContent] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [showSubparts, setShowSubparts] = useState({});
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useRecoilState(tokenAtom);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setIsLoggedIn(false);
            return;
        }

        setIsLoggedIn(true);
        setToken(storedToken);

        const fetchData = async (token) => {
            try {
                setLoading(true);
                const response = await fetchMyCourses(token);
                const purchasedCourses = response.map((enrollment) => enrollment.course._id);
                setIsPurchased(purchasedCourses.includes(id));

                const courseContent = await fetchCourseContent(id, token);
                setCourseData(courseContent);
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData(storedToken);
    }, [id]);

    useEffect(() => {
        if (courseData) {
            const initialShowSubparts = {};
            const initialProgress = {};

            courseData.forEach((course) => {
                initialShowSubparts[course._id] = false;
                initialProgress[course._id] = 0;
            });

            setShowSubparts(initialShowSubparts);
            setProgress(initialProgress);
        }
    }, [courseData]);

    const toggleCourseContent = () => setShowCourseContent(!showCourseContent);

    const toggleSubparts = (section) => {
        setShowSubparts((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const calculateTotalDuration = (subsections) => {
        return subsections.reduce((total, subsection) => total + subsection.duration, 0);
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-3xl font-bold mb-4 text-center">
                    You are not logged in
                </h2>
                <p className="text-gray-600 text-lg text-center">
                    Please log in to access the course content.
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </div>
        );
    }

    if (!isPurchased) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-3xl font-bold mb-4 text-center">
                    Access Denied
                </h2>
                <p className="text-gray-600 text-lg text-center">
                    Please purchase this course to access its content.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-10">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-100 border-b">
                    <div className="flex items-center cursor-pointer" onClick={toggleCourseContent}>
                        <h2 className="text-xl font-bold mr-2">Course Content</h2>
                        <svg
                            className={`transform transition-transform ${showCourseContent ? "rotate-180" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            width="20"
                            height="20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"
                            />
                        </svg>
                    </div>
                </div>
                {loading ? (
                    <Loader />
                ) : (
                    showCourseContent && (
                        <div className="p-4">
                            {courseData?.map((course) => (
                                <div key={course._id} className="mb-4">
                                    <FirstBox
                                        section={course.section}
                                        title={course.title}
                                        showSubparts={showSubparts[course._id]}
                                        toggleSubparts={() => toggleSubparts(course._id)}
                                        progress={progress[course._id]}
                                        timing={`${course.subsections.length} | ${Math.floor(
                                            calculateTotalDuration(course.subsections) / 60
                                        )} min`}
                                    />
                                    {showSubparts[course._id] && (
                                        <Subsection
                                            section={course._id}
                                            subsections={course.subsections}
                                            type={course.subsections[0].type}
                                            url={course.subsections[0].url}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default CourseContent;
