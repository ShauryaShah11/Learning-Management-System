import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal";
import { FaEye } from "react-icons/fa";

const SectionTable = ({ sections, handleEdit, handleDelete }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const confirmDelete = (sectionId) => {
        // Implement logic for deleting a course
        console.log(`Deleting course with ID ${sectionId}`);
        setModalIsOpen(false);
    };

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Add Materials</th>
                        <th className="py-2 px-4 border-b">View Sub sections</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sections?.map((section, index) => (
                        <tr key={section._id}>
                            <td className="py-2 px-4 border-b">
                                {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {section.title}
                            </td>                            
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => navigate(`/tutor/subsection/add/${section._id}`)}
                                    className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                >
                                    Add Sub Section
                                </button>
                            
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <Link
                                    to={`/tutor/subsection/${section._id}`}
                                    className="text-blue-500 hover:underline flex items-center justify-center"

                                >
                                    <FaEye className="mr-1" />{" "}
                                    {/* Add an eye icon */}
                                    View
                                </Link>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    onClick={() => handleEdit(section._id)}
                                    className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(section._id);
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

export default SectionTable;
