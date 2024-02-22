// ManageInstructors.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";

const ManageInstructors = () => {
  const [instructors, setInstructors] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    // Add more instructor data as needed
  ]);

  const handleEdit = (instructorId) => {
    // Implement logic for editing an instructor
    console.log(`Editing instructor with ID ${instructorId}`);
  };

  const handleDelete = (instructorId) => {
    // Implement logic for deleting an instructor
    console.log(`Deleting instructor with ID ${instructorId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Manage Instructors</h1>
      <div className="flex items-center  space-x-4 mb-6">
        <Link to={'/admin/addInstructor'} className="text-white bg-green-500 hover:bg-green-700 border p-2 shadow-inner rounded-md">Add Instructor</Link>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor.id}>
              <td className="py-2 px-4 border-b">{instructor.id}</td>
              <td className="py-2 px-4 border-b">{instructor.name}</td>
              <td className="py-2 px-4 border-b">{instructor.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(instructor.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(instructor.id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageInstructors;