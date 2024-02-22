import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { fetchCourse } from '../services/apiService';

function CourseDetails() {
    const { id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetchCourse(id);
                setCourseData(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course:', error);
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
        <div className='bg-gray-100 py-10'>
            <div className='container mx-auto flex flex-col sm:flex-row bg-white rounded-lg shadow-lg overflow-hidden'>
                <div className='w-full sm:w-2/3 p-8'>
                    <h1 className='text-4xl mb-4 text-gray-700 capitalize'>{courseData.courseName}</h1>
                    <p className='text-xl mb-4 text-gray-500 capitalize'>{courseData.description}</p>
                    <p className='text-lg mb-4 text-gray-500'>
                        Created By: <span className='text-blue-500 underline cursor-pointer' onClick={() => { navigate(`/tutor/${courseData.tutor._id}`) }}>{courseData.tutor.username}</span>
                    </p>
                    <p className='text-gray-500'>Last Updated : {new Date(courseData.dateUpdated).toLocaleDateString()}</p>
                </div>
                <div className='w-full sm:w-1/3 bg-gray-200 p-8'>
                    <div className='mb-6'>
                        <img src={courseData.thumbnailUrl} alt={courseData.courseName} className='w-full h-auto rounded-lg shadow-md' />
                    </div>
                    <div className='text-lg mb-4'>Price : ₹{courseData.price} </div>
                    <button className='w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-gray-600'>Buy This Course</button>
                </div>
            </div>
            <div className='container mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 text-center'>
                <div className='flex-1'>
                    <h2 className='text-xl text-gray-700'>Level</h2>
                    <p className='text-2xl text-gray-900 capitalize'>{courseData.level}</p>
                </div>  
                <div className='flex-1'>
                    <h2 className='text-xl text-gray-700'>PreRequitites</h2>
                    <p className='text-2xl text-gray-900 capitalize'>{courseData.prerequisites}</p>
                </div> 
                <div className='flex-1'>
                    <h2 className='text-xl text-gray-700'>Language</h2>
                    <p className='text-2xl text-gray-900 capitalize'>{courseData.language}</p>
                </div> 
            </div>
        </div>
    );
}

export default CourseDetails;