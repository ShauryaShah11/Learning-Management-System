import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import { FaEye } from "react-icons/fa";

const CourseTable = ({ courses, handleEdit, handleDelete, togglePublish }) => {
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
        <div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "5%" }}
                        >
                            ID
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "15%" }}
                        >
                            Title
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "10%" }}
                        >
                            Tutor
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "10%" }}
                        >
                            Category
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "10%" }}
                        >
                            Level
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "10%" }}
                        >
                            Price
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "10%" }}
                        >
                            Published
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "10%" }}
                        >
                            Enrolled Users
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "20%" }}
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={course._id}>
                            <td
                                className="py-2 px-4 border-b"
                                style={{ width: "5%" }}
                            >
                                {index + 1}
                            </td>
                            <td
                                className="py-2 px-4 border-b"
                                style={{ width: "15%" }}
                            >
                                {course.courseName}
                            </td>
                            <td
                                className="py-2 px-4 border-b"
                                style={{ width: "10%" }}
                            >
                                {course.tutor.username}
                            </td>
                            <td
                                className="py-2 px-4 border-b"
                                style={{ width: "10%" }}
                            >
                                {course.category.categoryName}
                            </td>
                            <td
                                className="py-2 px-4 border-b"
                                style={{ width: "10%" }}
                            >
                                {course.level}
                            </td>
                            <td
                                className="py-2 px-4 border-b"
                                style={{ width: "10%" }}
                            >
                                ₹{course.price}
                            </td>
                            <td
                                className="py-2 px-4 border-b text-center"
                                style={{ width: "10%" }}
                            >
                                <button
                                    onClick={() => togglePublish(course._id)}
                                    className={`px-3 py-1 rounded ${
                                        course.published
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-red-500 hover:bg-red-600"
                                    } text-white`}
                                >
                                    {course.published
                                        ? "Published"
                                        : "Unpublished"}
                                </button>
                            </td>

                            <td className="py-2 px-4 border-b text-center">
                                <Link
                                    to={`/admin/courses/enroll/${course._id}`}
                                    className="text-blue-500 hover:underline flex items-center justify-center"
                                >
                                    <FaEye className="mr-1" />{" "}
                                    {/* Add an eye icon */}
                                    View
                                </Link>
                            </td>
                            <td
                                className="py-2 px-4 border-b text-center"
                                style={{ width: "20%" }}
                            >
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
