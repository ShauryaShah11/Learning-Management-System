// ManageStudents.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";

const ManageStudents = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    // Add more student data as needed
  ]);

  const handleEdit = (studentId) => {
    // Implement logic for editing a student
    console.log(`Editing student with ID ${studentId}`);
  };

  const handleDelete = (studentId) => {
    // Implement logic for deleting a student
    console.log(`Deleting student with ID ${studentId}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Students</h1>
      <div className="hidden md:flex flex items-center space-x-4 ">
        
        <Link to={'/admin/addstudent'} className="text-black hover:text-gray border p-2 shadow-inner rounded-md bg-green">Add Course</Link>
        
                   
                   
                </div>
                <div className='pt-5 pb-5'></div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="py-2 px-4 border-b">{student.id}</td>
              <td className="py-2 px-4 border-b">{student.name}</td>
              <td className="py-2 px-4 border-b">{student.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(student.id)}
                  className="bg-blue text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="bg-red text-white px-3 py-1 rounded"
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

export default ManageStudents;
