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

    return (
        <>
            {loading ? (
                <div className='m-10'>
                    <Loader color="#00BFFF" loading={loading} size={30} />
                </div>
            ) : (
                <>
                    <div className="container mx-auto px-4 py-8 relative">
                        <div className="max-w-full mx-auto">
                            {/* Category Name Over Image */}
                            <h1 className="text-3xl font-semibold mb-4 absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10 bg-black bg-opacity-50 px-4 py-2 rounded">
                                {category?.categoryName}
                            </h1>

                            <div className="max-w-lg mx-auto mb-6">
                                <img
                                    src={category?.coverImageUrl}
                                    alt="Category"
                                    className="w-full h-auto rounded-lg shadow-md"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-xl sm:text-3xl font-bold px-4">
                        Explore Total {category.courseCount} Course from this category
                        <CourseCard courses={courses} />
                    </div>
                </>
            )}
        </>
    );
}

export default Category;
