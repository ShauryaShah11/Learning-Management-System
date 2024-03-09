import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchTutorCourses } from "../../services/secureApiService";
import { useRecoilState } from "recoil";
import { courseAtom } from "../../store/atoms/course";
import CourseTable from "../../components/tutor/CourseTable";
import { jwtDecode } from "jwt-decode";

const CourseList = () => {
    const [decodedToken, setDecodedToken] = useState(null);
    const [courses, setCourses] = useRecoilState(courseAtom);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const decodedToken = jwtDecode(token);
                const response = await fetchTutorCourses(decodedToken.id);
                setCourses(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCoursesData();
    }, []);

    const handleEdit = (courseId) => {
        navigate(`/tutor/courses/${courseId}`);
    };

    const handleDelete = (courseId) => {
        console.log(`Deleting course with ID ${courseId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="#00BFFF" loading={loading} size={20} />
            </div>
        );
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
            <div className="hidden md:flex flex items-center space-x-4 pb-5">
                <Link
                    to={"/tutor/courses/add"}
                    className="text-black hover:text-gray border p-2 shadow-inner rounded-md bg-green"
                >
                    Add Course
                </Link>
            </div>
            <CourseTable
                courses={courses}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default CourseList;
