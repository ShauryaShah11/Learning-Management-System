import { useState, useEffect } from "react";
import FirstBox from "../components/FirstBox";
import Subsection from "../components/Subsection";
import { useParams } from "react-router-dom";
import { fetchCourseContent } from "../services/secureApiService";
import useToken from "../hooks/useToken";

function CourseContent() {
    const { id } = useParams();
    const [showCourseContent, setShowCourseContent] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [showSubparts, setShowSubparts] = useState({});
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(false);
    const [token] = useToken();

    useEffect(() => {
        const fetchCoursesContentData = async () => {
            try {
                setLoading(true);
                const response = await fetchCourseContent(id, token);
                setCourseData(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoursesContentData();
    }, [id, token]);

    useEffect(() => {
        if (courseData) {
            // Initialize showSubparts and progress state based on courseData
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

    const handleCheckboxChange = (section, isChecked) => {
        setProgress((prev) => ({
            ...prev,
            [section]: isChecked ? prev[section] + 1 : prev[section] - 1,
        }));
    };

    const calculateTotalDuration = (subsections) => {
        let totalDuration = 0;
        subsections.forEach((subsection) => {
            totalDuration += subsection.duration;
        });
        return totalDuration;
    };

    return (
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={toggleCourseContent}>
                <h2 style={{ fontSize: "24px", marginRight: "10px" }}>Course Content</h2>
                <svg style={{ width: "20px", height: "20px", transition: "transform 0.3s", transform: `${showCourseContent ? "rotate(180deg)" : ""}` }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"></path>
                </svg>
            </div>
            {showCourseContent && (
                <div style={{ marginTop: "20px" }}>
                    {courseData?.map((course, index) => (
                        <div key={course._id} style={{ marginBottom: "20px" }}>
                            <FirstBox
                                section={index + 1}
                                title={course.title}
                                showSubparts={showSubparts[course._id]}
                                toggleSubparts={() => toggleSubparts(course._id)}
                                progress={progress[course._id]}
                                timing={`${course.subsections.length} | ${calculateTotalDuration(course.subsections)}min`}
                            />
                            {showSubparts[course._id] && (
                                <Subsection
                                    section={course._id}
                                    subsections={course.subsections}
                                    onCheckboxChange={handleCheckboxChange}
                                    type={course.subsections[0].type}
                                    url={course.subsections[0].url}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CourseContent;
