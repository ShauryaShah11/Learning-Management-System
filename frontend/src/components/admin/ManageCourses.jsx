import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import { fetchAllCourses } from "../../services/secureApiService";
import ConfirmationModal from "../ConfirmationModal";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  useEffect(() => {
    const fetchCoursesData  = async () => {
      try{
        setLoading(true);
        const response = await fetchAllCourses();
        console.log(response)
        setCourses(response);
        setLoading(false);
      }
      catch(error) {
        console.error(error);
      }
    }
    fetchCoursesData ();
  }, [])

  const handleEdit = (courseId) => {
    // Implement logic for editing a course
    console.log(`Editing course with ID ${courseId}`);
  };

  const handleDelete = (courseId) => {
    // Implement logic for deleting a course
    console.log(`Deleting course with ID ${courseId}`);
    setModalIsOpen(true);
  };

  const confirmDelete = () => {
    // Implement logic for deleting a course
    console.log(`Deleting course with ID ${selectedCourseId}`);
    setModalIsOpen(false);
  };

  if (loading) {
    return (
        <div className='flex justify-center items-center h-screen'>
            <Loader color="#00BFFF" loading={loading} size={20} />
        </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
      {/* User-related Options */}
      <div className="hidden md:flex flex items-center space-x-4 ">
        <Link
          to={"/admin/addcourse"}
          className="text-black hover:text-gray border p-2 shadow-inner rounded-md bg-green"
        >
          Add Course
        </Link>
      </div>
      <div className="pt-5 pb-5"></div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Tutor</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Level</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Published</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={course._id}>
              <td className="py-2 px-4 border-b text-center">{index+1}</td>
              <td className="py-2 px-4 border-b text-center">{course.courseName}</td>
              <td className="py-2 px-4 border-b text-center">{course.tutor.username}</td>
              <td className="py-2 px-4 border-b text-center">{course.category.categoryName}</td>
              <td className="py-2 px-4 border-b text-center">{course.level}</td>
              <td className="py-2 px-4 border-b text-center">₹{course.price}</td>
              <td className="py-2 px-4 border-b text-center">{course.published ? "true" : "false"}</td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleEdit(course._id)}
                  className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ManageCourses;
