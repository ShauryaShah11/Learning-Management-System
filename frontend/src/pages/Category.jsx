import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCategoryWithCoursesData } from '../services/apiService';
import Loader from '../components/Loader';
import CourseCard from '../components/CourseCard';

function Category() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await fetchCategoryWithCoursesData(id);
                setCategory(response);
                setCourses(response.courses);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching category:', error);
                setLoading(false);
            }
        };
        fetchCategoryData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader color="#4F46E5" loading={loading} size={40} />
                    <p className="mt-4 text-gray-600 animate-pulse">Loading category...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section with Overlay */}
            <div className="relative">
                {/* Full-width background image with overlay */}
                <div className="h-[40vh] md:h-[50vh] w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
                    <img
                        src={category?.coverImageUrl}
                        alt={category?.categoryName}
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                
                {/* Content positioned over the image */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            {category?.categoryName}
                        </h1>
                        {category?.description && (
                            <p className="text-lg md:text-xl text-white max-w-2xl mx-auto opacity-90 leading-relaxed">
                                {category.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Category Stats Bar */}
            <div className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-wrap justify-center md:justify-between items-center">
                        <div className="flex items-center space-x-2 text-gray-700 px-4 py-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            <span>{courses?.length || 0} Courses</span>
                        </div>
                        
                        <div className="flex space-x-4">
                            <div className="flex items-center space-x-2 text-gray-700 px-4 py-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Updated {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Category Description */}
                {category?.longDescription && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">About this Category</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {category.longDescription}
                        </p>
                    </div>
                )}
                
                {/* Courses Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                {courses?.length > 0 ? `Courses in ${category?.categoryName}` : "No courses found"}
                            </h2>
                            <div className="w-20 h-1 bg-indigo-600 rounded mt-2"></div>
                        </div>
                        
                        {courses?.length > 0 && (
                            <div className="text-gray-600">
                                {courses.length} {courses.length === 1 ? 'course' : 'courses'} available
                            </div>
                        )}
                    </div>
                    
                    {courses?.length > 0 ? (
                        <CourseCard courses={courses} />
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No courses available yet</h3>
                            <p className="text-gray-600 mb-6">
                                We're working on adding courses to this category. Please check back soon.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Category;