import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";

const InstructorTable = ({ instructors, handleEdit, handleDelete }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    const confirmDelete = () => {
        handleDelete(selectedId);
        setModalIsOpen(false);
        setSelectedId(null);
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
                        <th className="py-2 px-4 border-b capitalize">ID</th>
                        <th className="py-2 px-4 border-b capitalize">
                            Username
                        </th>
                        <th className="py-2 px-4 border-b capitalize">
                            Expertise
                        </th>
                        <th className="py-2 px-4 border-b capitalize">Bio</th>
                        <th className="py-2 px-4 border-b capitalize">
                            Year Of Experience(Year)
                        </th>
                        {/* <th className="py-2 px-4 border-b">View Courses</th> */}
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {instructors.map((instructor, index) => (
                        <tr key={instructor._id}>
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">
                                {instructor.userId.username}
                            </td>

                            <td className="py-2 px-4 border-b">
                                {instructor.expertise}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {instructor.bio}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {instructor.yearOfExperience}
                            </td>

                            <td className="py-2 px-4 border-b">
                                <div className="flex justify-center">
                                    <button
                                        onClick={() =>
                                            handleEdit(instructor._id)
                                        }
                                        className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteClick(instructor._id);
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

export default InstructorTable;
