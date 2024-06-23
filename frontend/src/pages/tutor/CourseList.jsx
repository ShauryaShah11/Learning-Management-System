import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import {
    fetchTutorCourses,
    removeCourse,
} from "../../services/secureApiService";
import { useRecoilState } from "recoil";
import { courseAtom } from "../../store/atoms/course";
import CourseTable from "../../components/tutor/CourseTable";
import { jwtDecode } from "jwt-decode";
import { tokenAtom } from "../../store/atoms/token";
import toast from "react-hot-toast";

const CourseList = () => {
    const [decodedToken, setDecodedToken] = useState(null);
    const [courses, setCourses] = useRecoilState(courseAtom);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useRecoilState(tokenAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                setLoading(true);
                const decodedToken = jwtDecode(token);
                const response = await fetchTutorCourses(
                    decodedToken.id,
                    token
                );
                setCourses(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCoursesData();
    }, [token]); // Include token in the dependency array

    const handleEdit = (courseId) => {
        navigate(`/tutor/courses/${courseId}`);
    };

    const handleDelete = async (courseId) => {
        try {
            await removeCourse(courseId, token);
            toast.success("course successfully removed");
        } catch (error) {
            toast.error("Failed to remove course");
            console.error(error);
        }
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
            <h1 className="text-xl font-bold mb-6">Manage Courses</h1>
            <div className="hidden md:flex flex items-center space-x-4 pb-5">
                <Link
                    to={"/tutor/courses/add"}
                    className="text-white hover:text-gray border p-2 shadow-inner rounded-md bg-blue-500"
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
