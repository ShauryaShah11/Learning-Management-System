import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { fetchCourseByTutorId } from "../services/apiService";
import CourseCard from "../components/CourseCard";

function TutorDetils() {
    const { id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetchCourseByTutorId(id);
                setCourseData(response);
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id]);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loader color="#00BFFF" loading={loading} size={20} />
            </div>
        )
    }
    return (
        <div  className="container mx-auto">
            <CourseCard courses={courseData} />
        </div>
    );
}

export default TutorDetils;