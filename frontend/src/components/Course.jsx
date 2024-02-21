import { useState } from "react";
import Loader from "./Loader";
import ReactPaginate from 'react-paginate';

function Course({ courses }) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Start from page 1
  const itemsPerPage = 8; // Set the number of items to display per page

  // Calculate the indexes of the courses to display on the current page
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses?.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  return (
    <div className="container mx-auto">
      {loading ? (
        <Loader color="#00BFFF" loading={loading} size={30} />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 m-4">
          {currentCourses?.map((course, index) => (
            <div key={index} className="bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
              <img
                src={course.thumbnailUrl} // Use course.imageUrl instead of a static path
                alt={course.courseName} // Use course.courseName instead of a static alt
                className="w-full h-40 sm:h-48 object-cover rounded-t-md"
              />
              <div className="p-4 flex justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-black">
                  {course.courseName}
                </h3>
                <div className="text-lg sm:text-xl font-bold text-black">
                  ₹{course.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel="previous"
          nextLabel="next"
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(courses.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"flex bg-white p-4  rounded"}
          pageClassName={"mx-2 cursor-pointer bg-black"}
          previousClassName={"mx-2 cursor-pointer text-base"}
          nextClassName={"mx-2 cursor-pointer text-base"}
          activeClassName={"bg-blue-500 text-white"}
          pageLinkClassName={"px-3 py-1 rounded-md hover:bg-gray-200"}
          previousLinkClassName={"px-3 py-1 rounded-md hover:bg-gray-200"}
          nextLinkClassName={"px-3 py-1 rounded-md hover:bg-gray-200"}
        />
      </div>
    </div>
  );
}

export default Course;