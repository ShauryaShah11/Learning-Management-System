import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchAllCourses } from "../../services/secureApiService";
import { useRecoilState } from "recoil";
import { courseAtom } from "../../store/atoms/course";
import CourseTable from "../../components/CourseTable";
import { tokenAtom } from "../../store/atoms/token";

const CourseList = () => {
    const [courses, setCourses] = useRecoilState(courseAtom);
    const [loading, setLoading] = useState(true); // Initialize loading as true
    const [token, setToken] = useRecoilState(tokenAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                const response = await fetchAllCourses(token);
                setCourses(response);
            } catch (error) {
                console.error(error);
                // Handle error here, if needed
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };
        
        fetchCoursesData();
    }, [token, setCourses]); // Include token and setCourses in the dependency array

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, [setToken]); // Include setToken in the dependency array

    const handleEdit = (courseId) => {
        navigate(`/admin/courses/${courseId}`);
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
                    to={"/admin/addcourse"}
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
