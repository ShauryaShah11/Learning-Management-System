import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader";
import { fetchEnrolledUsers } from "../../services/secureApiService";
import ConfirmationModal from "../ConfirmationModal";

const EnrolledUsers = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  useEffect(() => {
    const fetchCoursesData  = async () => {
      try{
        setLoading(true);
        const response = await fetchEnrolledUsers(id);
        setUsers(response);
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
    // console.log(`Deleting course with ID ${courseId}`);
    setModalIsOpen(true);
  };

  const confirmDelete = () => {
    // Implement logic for deleting a course
    // console.log(`Deleting course with ID ${selectedCourseId}`);
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
      <div className="pt-5 pb-5"></div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Contact Number</th>
            <th className="py-2 px-4 border-b">Age</th>           
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b text-center">{index+1}</td>
              <td className="py-2 px-4 border-b text-center">{user.username}</td>
              <td className="py-2 px-4 border-b text-center">{`${user.firstName}  ${user.lastName}`}</td>
              <td className="py-2 px-4 border-b text-center">{user.email}</td>
              <td className="py-2 px-4 border-b text-center">{user.contactNumber}</td>
              <td className="py-2 px-4 border-b text-center">{user.age}</td>
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

export default EnrolledUsers;
