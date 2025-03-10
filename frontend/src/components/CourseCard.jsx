import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function CourseCard({ courses, loading }) {
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const itemsPerPage = 8;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Handle window resize for responsive adjustments
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = Array.isArray(courses)
        ? courses.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    // Change page
    const handlePageClick = ({ selected }) => setCurrentPage(selected);

    return (
        <div className="container mx-auto px-4">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Explore Our Courses</h2>
                <div className="w-20 h-1 bg-indigo-600 rounded"></div>
                <p className="mt-4 text-gray-600">Discover the perfect course to enhance your skills and knowledge</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader color="#4F46E5" loading={loading} size={30} />
                    <p className="mt-4 text-gray-600">Loading amazing courses for you...</p>
                </div>
            ) : (
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {currentCourses?.map((course, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                            onClick={() => navigate(`/course/${course._id}`)}
                        >
                            <div className="relative overflow-hidden">
                                {/* Course thumbnail with gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                
                                <img
                                    src={course.thumbnailUrl}
                                    alt={course.courseName}
                                    className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {/* Badge for course level */}
                                {course.level && (
                                    <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full z-20">
                                        {course.level}
                                    </div>
                                )}
                                
                                {/* Price badge */}
                                <div className="absolute bottom-3 right-3 bg-white text-indigo-700 font-bold px-3 py-1 rounded-full shadow-md z-20">
                                    ₹{course.price}
                                </div>
                            </div>
                            
                            <div className="p-6">
                                {/* Course title */}
                                <h3 className="font-bold text-xl text-gray-800 line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {course.courseName}
                                </h3>
                                
                                {/* Course description or summary if available */}
                                {course.description && (
                                    <p className="text-gray-600 line-clamp-2 text-sm mb-4">
                                        {course.description}
                                    </p>
                                )}
                                
                                {/* Course metadata */}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
                                    {/* Duration or lessons info */}
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        {course.duration || "Self-paced"}
                                    </div>
                                    
                                    {/* View button */}
                                    <button className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-700 hover:text-white transition-colors duration-300 font-medium px-3 py-1 rounded-md text-sm">
                                        View Course
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state when no courses */}
            {!loading && (!currentCourses || currentCourses.length === 0) && (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">We couldn't find any courses matching your criteria. Try adjusting your filters or check back later.</p>
                </div>
            )}

            {/* Enhanced Pagination with visual design */}
            {!loading && courses?.length > itemsPerPage && (
                <div className="mt-12 mb-8">
                    <div className="flex justify-center">
                        <ReactPaginate
                            previousLabel={
                                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-l-lg hover:bg-indigo-50 transition-colors">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    <span>Previous</span>
                                </button>
                            }
                            nextLabel={
                                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-r-lg hover:bg-indigo-50 transition-colors">
                                    <span>Next</span>
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            }
                            breakLabel={
                                <span className="px-4 py-2 border border-gray-300">...</span>
                            }
                            pageCount={Math.ceil((courses?.length || 0) / itemsPerPage)}
                            marginPagesDisplayed={windowWidth > 640 ? 2 : 1}
                            pageRangeDisplayed={windowWidth > 640 ? 3 : 1}
                            onPageChange={handlePageClick}
                            containerClassName="flex items-center space-x-1"
                            pageClassName="block"
                            pageLinkClassName="flex items-center justify-center w-10 h-10 border border-gray-300 rounded bg-white hover:bg-indigo-50 text-gray-700 transition-colors"
                            activeLinkClassName="flex items-center justify-center w-10 h-10 border-0 rounded bg-indigo-600 text-white"
                            previousClassName={`${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            nextClassName={`${currentPage === Math.ceil((courses?.length || 0) / itemsPerPage) - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabledClassName="opacity-50 cursor-not-allowed"
                            breakClassName="block"
                        />
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, courses?.length || 0)} of {courses?.length || 0} courses
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseCard;