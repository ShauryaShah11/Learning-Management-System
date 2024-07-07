import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

const UserTable = ({ users, handleEdit, handleDelete }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

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
                        <th className="py-2 px-4 border-b capitalize">ID</th>
                        <th className="py-2 px-4 border-b capitalize">
                            Username
                        </th>
                        <th className="py-2 px-4 border-b capitalize">
                            Full Name
                        </th>
                        <th className="py-2 px-4 border-b capitalize">email</th>
                        <th className="py-2 px-4 border-b capitalize">
                            Contact Number
                        </th>
                        <th className="py-2 px-4 border-b">Age</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td className="py-2 px-4 border-b ">{index + 1}</td>
                            <td className="py-2 px-4 border-b ">
                                {user.username}
                            </td>

                            <td className="py-2 px-4 border-b  capitalize">
                                {user.firstName} {user.lastName}
                            </td>
                            <td className="py-2 px-4 border-b ">
                                {user.email}
                            </td>
                            <td className="py-2 px-4 border-b ">
                                {user.contactNumber}
                            </td>
                            <td className="py-2 px-4 border-b ">{user.age}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleEdit(user._id)}
                                        className="bg-blue-700 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteClick(user._id);
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

export default UserTable;
