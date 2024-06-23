import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourseContent, fetchMyCourses } from "../services/secureApiService";
import useToken from "../hooks/useToken";
import FirstBox from "../components/FirstBox";
import Subsection from "../components/Subsection";
import Loader from "../components/Loader"; // Assuming you have a Loader component for loading states
import toast from "react-hot-toast";
import { tokenAtom } from "../store/atoms/token";
import { useRecoilState } from "recoil";

function CourseContent() {
    const { id } = useParams();
    const [showCourseContent, setShowCourseContent] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [showSubparts, setShowSubparts] = useState({});
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useRecoilState(tokenAtom);
    const [isPurchased, setIsPurchased] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            toast.error("Please login to view content");
            navigate("/login");
            return;
        }
    
        setToken(storedToken);
    
        const fetchData = async (token) => {
            try {
                setLoading(true);
    
                // Fetch user's courses
                const response = await fetchMyCourses(token);
                const purchasedCourses = response.map((enrollment) => enrollment.course._id);
                setIsPurchased(purchasedCourses.includes(id));
    
                // Fetch course content
                const courseContent = await fetchCourseContent(id, token);
                setCourseData(courseContent);
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData(storedToken);
    }, [id, navigate]);
    
    

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

    const toggleCourseContent = () => {
        setShowCourseContent(!showCourseContent);
    };

    const toggleSubparts = (section) => {
        setShowSubparts((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const calculateTotalDuration = (subsections) => {
        return subsections.reduce((total, subsection) => total + subsection.duration, 0);
    };

    if (!isPurchased) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-3xl font-bold mb-4 text-center">
                    Access Denied
                </h2>
                <p className="text-gray-600 text-lg text-center">
                    Please purchase this course to access its content.
                </p>
                {/* Add a button or link to the purchase page if needed */}
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
                    <Loader /> // Placeholder for loading state
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
                                            type={course.subsections[0].type} // Assuming all subsections have the same type
                                            url={course.subsections[0].url} // Assuming you want to display URL of first subsection
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
