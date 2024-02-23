import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { fetchCourses } from "../services/apiService";
import Loader from "../components/Loader";

function Course(){
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchCoursesData  = async () => {
          try{
            setLoading(true);
            const response = await fetchCourses();
            setCourses(response);
            setLoading(false);
          }
          catch(error) {
            console.error(error);
          }
        }
        fetchCoursesData();
    }, [])

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loader color="#00BFFF" loading={loading} size={20} />
            </div>
        )
    }
    return (
        <div className="container mx-auto px-4">
            <div className="w-full max-w-md mx-auto my-10">
                <input 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text" 
                    placeholder="Filter courses..." 
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
            </div>
            <div>
                <CourseCard courses={courses}/>
            </div>
        </div>
    );
}

export default Course;