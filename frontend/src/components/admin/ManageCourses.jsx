// ManageCourses.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";

const ManageCourses = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: 'React Basics', category: 'Web Development' },
    { id: 2, title: 'Python for Beginners', category: 'Programming' },
    // Add more course data as needed
  ]);

  const handleEdit = (courseId) => {
    // Implement logic for editing a course
    console.log(`Editing course with ID ${courseId}`);
  };

  const handleDelete = (courseId) => {
    // Implement logic for deleting a course
    console.log(`Deleting course with ID ${courseId}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
       {/* User-related Options */}
       <div className="hidden md:flex flex items-center space-x-4 ">
        
        <Link to={'/admin/addcourse'} className="text-black hover:text-gray border p-2 shadow-inner rounded-md bg-green">Add Course</Link>
        
                   
                   
                </div>
                <div className='pt-5 pb-5'></div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="py-2 px-4 border-b">{course.id}</td>
              <td className="py-2 px-4 border-b">{course.title}</td>
              <td className="py-2 px-4 border-b">{course.category}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(course.id)}
                  className="bg-blue text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
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

export default ManageCourses;
