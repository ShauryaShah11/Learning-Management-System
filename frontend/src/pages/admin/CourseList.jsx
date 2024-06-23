import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchAllCourses, removeCourse, toggleCourse } from "../../services/secureApiService";
import { useRecoilState } from "recoil";
import { courseAtom } from "../../store/atoms/course";
import CourseTable from "../../components/CourseTable";
import { tokenAtom } from "../../store/atoms/token";
import toast from "react-hot-toast";

const CourseList = () => {
    const [courses, setCourses] = useRecoilState(courseAtom);
    const [loading, setLoading] = useState(true); // Initialize loading as true
    const [token, setToken] = useRecoilState(tokenAtom);
    const navigate = useNavigate();

    const fetchCoursesData = async () => {
        try {
            const response = await fetchAllCourses(token);
            setCourses(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoursesData();
    }, [setCourses]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []); 

    const handleEdit = (courseId) => {
        navigate(`/admin/courses/${courseId}`);
    };

    const handleDelete = async (courseId) => {
        try{
            await removeCourse(courseId, token);
            toast.success('course successfully removed');
        }
        catch(error) {
            toast.error('Failed to remove course');
            console.error(error);
        }
    };

    const togglePublish = async (courseId) => {
        try {
            setLoading(true);
            await toggleCourse(courseId, token);
            fetchCoursesData();
            toast.success("Course toggle successfully");
        } catch (error) {
            console.error(error);
            toast.error("Error toggling course");
        } finally {
            setLoading(false);
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
            <CourseTable
                courses={courses}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                togglePublish={togglePublish}
            />
        </>
    );
};

export default CourseList;