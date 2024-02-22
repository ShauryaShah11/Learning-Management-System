// AddCategoryForm.jsx
import React, { useState } from 'react';

const AddCategoryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mb-4">
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-semibold mb-2">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border py-2 px-3 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter category name"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
        >
          Add Category
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddCategoryForm;
