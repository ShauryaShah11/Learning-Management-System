import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal";
import { FaEye } from "react-icons/fa";

const CourseTable = ({ courses, handleEdit, handleDelete }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    const confirmDelete = () => {
        handleDelete(selectedId);
        setSelectedId(null);
        setModalIsOpen(false);
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setModalIsOpen(true);
    };

    return (
        <div className="overflow-x-auto">
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
                            <td className="py-2 px-4 border-b ">{index + 1}</td>
                            <td className="py-2 px-4 border-b ">
                                {course.courseName}
                            </td>
                            <td className="py-2 px-4 border-b ">
                                {course.level}
                            </td>
                            <td className="py-2 px-4 border-b ">
                                ₹{course.price}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {course.published ? (
                                    <span className="bg-green-500 text-white py-1 px-2 rounded">
                                        Published
                                    </span>
                                ) : (
                                    <span className="bg-red-500 text-white py-1 px-2 rounded">
                                        Unpublished
                                    </span>
                                )}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <Link
                                    to={`/tutor/courses/enroll/${course._id}`}
                                    className="text-blue-500 hover:underline flex items-center justify-center"
                                >
                                    <FaEye className="mr-1" />{" "}
                                    {/* Add an eye icon */}
                                    View
                                </Link>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <Link
                                    to={`/tutor/section/add/${course._id}`}
                                    className="bg-blue-700 text-white px-3 py-1 rounded mr-2 flex justify-center"
                                >
                                    Add Section
                                </Link>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() =>
                                        navigate(`/tutor/section/${course._id}`)
                                    }
                                    className="text-blue-500 hover:underline flex items-center justify-center"
                                >
                                    <FaEye className="mr-1" />{" "}
                                    {/* Add an eye icon */}
                                    View
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleEdit(course._id)}
                                        className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteClick(course._id);
                                        }}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
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
