// ManageCategories.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";

const ManageCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'Programming' },
    // Add more category data as needed
  ]);

  const handleEdit = (categoryId) => {
    // Implement logic for editing a category
    console.log(`Editing category with ID ${categoryId}`);
  };

  const handleDelete = (categoryId) => {
    // Implement logic for deleting a category
    console.log(`Deleting category with ID ${categoryId}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      <div className="hidden md:flex flex items-center space-x-4 ">
        
        <Link to={'/admin/addcategory'} className="text-black hover:text-gray border p-2 shadow-inner rounded-md bg-green">Add Category</Link>
        
                   
                   
                </div>
                <div className='pt-5 pb-5'></div>
      <table className="min-w-full bg-white border border-gray">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="py-2 px-4 border-b">{category.id}</td>
              <td className="py-2 px-4 border-b">{category.name}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(category.id)}
                  className="bg-blue-13  text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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

export default ManageCategories;
