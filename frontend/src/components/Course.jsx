import { useState } from "react";
import Pagination from "react-js-pagination";
import { BeatLoader } from "react-spinners";

function Course() {
  const [activePage, setActivePage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsCountPerPage = 3;
  const totalItemsCount = 9;

  const handlePageChange = (pageNumber) => {
    setLoading(true);
    // Fetch new data according to pageNumber
    // Your fetch or axios call here
    // Assume fetchData is your asynchronous data fetching function
    fetchData(pageNumber)
      .then(() => {
        setActivePage(pageNumber);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchData = async (pageNumber) => {
    // Simulate fetching data with setTimeout
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="container mx-auto">
      {loading ? (
        <div className="flex justify-center items-center">
          <BeatLoader color="#00BFFF" loading={loading} size={20} />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 m-4">
          <div className="bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
            <img
              src="/images/course.jpg"
              alt="course1"
              className="w-full h-40 sm:h-48 object-cover rounded-t-md"
            />
            <div className="p-4 flex justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-black">
                Course 1
              </h3>
              <div className="text-lg sm:text-xl font-bold text-black">
                $599
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Course;