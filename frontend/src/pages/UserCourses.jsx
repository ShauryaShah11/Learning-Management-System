import { useEffect, useState } from "react";
import { fetchMyCourses } from "../services/secureApiService";
import CourseCard from "../components/CourseCard";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";

function UserCourses() {
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useRecoilState(tokenAtom);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        const fetchMyCoursesData = async () => {
            try {
                setLoading(true);
                const response = await fetchMyCourses(token);
                const courses = response.map((enrollment) => enrollment.course);
                setCourseData(courses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            fetchMyCoursesData();
        }
    }, [token]);

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
