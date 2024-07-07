import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal";
import { useNavigate } from "react-router-dom";

const CategoryTable = ({ categories, handleEdit, handleDelete }) => {
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
            <table className="min-w-full bg-white border border-gray">
                <thead>
                    <tr>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "10%" }}
                        >
                            ID
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "20%" }}
                        >
                            Name
                        </th>
                        <th
                            className="py-2 px-4 border-b"
                            style={{ width: "50%" }}
                        >
                            Courses
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
                    {categories.map((category, index) => (
                        <tr key={category.id}>
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">
                                {category.categoryName}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {category.description}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleEdit(category._id)}
                                        className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteClick(category._id)
                                        }
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

export default CategoryTable;
