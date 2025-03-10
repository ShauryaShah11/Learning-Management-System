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
    const [activeSection, setActiveSection] = useState(null);
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
                
                // Set the first section as active by default
                if (courseContent && courseContent.length > 0) {
                    setActiveSection(courseContent[0]._id);
                }
                
            } catch (error) {
                console.error("Error fetching course data:", error);
                toast.error("Failed to load course content");
            } finally {
                setLoading(false);
            }
        };

        fetchData(storedToken);
    }, [id, setToken]);

    useEffect(() => {
        if (courseData) {
            const initialShowSubparts = {};
            const initialProgress = {};

            courseData.forEach((course) => {
                // Show the first section by default
                initialShowSubparts[course._id] = course._id === activeSection;
                // Random progress value for demonstration (you would calculate this based on user progress)
                initialProgress[course._id] = Math.floor(Math.random() * 100);
            });

            setShowSubparts(initialShowSubparts);
            setProgress(initialProgress);
        }
    }, [courseData, activeSection]);

    const toggleCourseContent = () => setShowCourseContent(!showCourseContent);

    const toggleSubparts = (section) => {
        setShowSubparts((prev) => {
            // Close all other sections when opening a new one
            const newState = {};
            Object.keys(prev).forEach(key => {
                newState[key] = key === section && !prev[key];
            });
            return newState;
        });
        
        // Set active section for content display
        setActiveSection(section);
    };

    const calculateTotalDuration = (subsections) => {
        return subsections.reduce((total, subsection) => total + subsection.duration, 0);
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">
                        Authentication Required
                    </h2>
                    <p className="text-gray-600 text-lg mb-6">
                        Please sign in to access the course content.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (!isPurchased) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 text-lg mb-6">
                        You need to purchase this course to access its content.
                    </p>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate(`/courses/${id}`)}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            View Course
                        </button>
                        <button
                            onClick={() => navigate("/courses")}
                            className="flex-1 py-3 px-6 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-200"
                        >
                            Browse Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Course Content Header */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                        <div className="flex items-center cursor-pointer" onClick={toggleCourseContent}>
                            <h2 className="text-2xl font-bold text-white mr-3">Course Content</h2>
                            <svg
                                className={`w-5 h-5 text-white transform transition-transform ${showCourseContent ? "rotate-180" : ""}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    
                    {/* Content Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader color="#3B82F6" size={40} />
                        </div>
                    ) : (
                        showCourseContent && (
                            <div className="p-6">
                                {courseData?.map((course) => (
                                    <div key={course._id} className="mb-6">
                                        <FirstBox
                                            section={course.section}
                                            title={course.title}
                                            showSubparts={showSubparts[course._id]}
                                            toggleSubparts={() => toggleSubparts(course._id)}
                                            progress={progress[course._id]}
                                            timing={`${course.subsections.length} lectures | ${Math.floor(
                                                calculateTotalDuration(course.subsections) / 60
                                            )} minutes total`}
                                            isActive={course._id === activeSection}
                                        />
                                        {showSubparts[course._id] && (
                                            <Subsection
                                                section={course._id}
                                                subsections={course.subsections}
                                                type={course.subsections[0]?.type || "videos"}
                                                url={course.subsections[0]?.url || ""}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
                
                {/* Course Resources */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Resources</h3>
                        <div className="flex flex-wrap gap-4">
                            <a 
                                href="#" 
                                className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-100 transition-colors duration-200"
                            >
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Course Slides</h4>
                                    <p className="text-xs text-gray-500">PDF Document • 2.4 MB</p>
                                </div>
                            </a>
                            <a 
                                href="#" 
                                className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-100 transition-colors duration-200"
                            >
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Practice Files</h4>
                                    <p className="text-xs text-gray-500">ZIP Archive • 18 MB</p>
                                </div>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseContent;