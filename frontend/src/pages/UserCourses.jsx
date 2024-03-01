import { useEffect, useState } from "react";
import { fetchMyCourses } from "../services/secureApiService";
import CourseCard from "../components/CourseCard";

function UserCourses() {
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMyCoursesData = async () => {
            try {
                setLoading(true);
                const response = await fetchMyCourses();
                const courses = response.map(enrollment => enrollment.course);
                setCourseData(courses);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };
        fetchMyCoursesData();
    }, []);
    return (
        <>
            <div className="flex justify-center text-4xl mt-10">My Courses</div>
            <div>
                <CourseCard courses={courseData} />
            </div>
        </>
    );
}

export default UserCourses;
