import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal";

const CourseTable = ({ courses, handleEdit, handleDelete }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const confirmDelete = (courseId) => {
        // Implement logic for deleting a course
        console.log(`Deleting course with ID ${courseId}`);
        setModalIsOpen(false);
    };

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Level</th>
                        <th className="py-2 px-4 border-b">Price</th>
                        <th className="py-2 px-4 border-b">Published</th>
                        <th className="py-2 px-4 border-b">Enrolled Users</th>
                        <th className="py-2 px-4 border-b">Add Materials</th>
                        <th className="py-2 px-4 border-b">Sections</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={course._id}>
                            <td className="py-2 px-4 border-b text-center">
                                {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {course.courseName}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {course.level}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                ₹{course.price}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {course.published ? "true" : "false"}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <Link
                                    to={`/tutor/courses/enroll/${course._id}`}
                                >
                                    View
                                </Link>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => navigate(`/tutor/section/add/${course._id}`)}
                                    className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                >
                                    Add Section
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => navigate(`/tutor/section/${course._id}`)}
                                    className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                >
                                    View Section
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => handleEdit(course._id)}
                                    className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(course._id);
                                        setModalIsOpen(true);
                                    }}
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

export default CourseTable;
