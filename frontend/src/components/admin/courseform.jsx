// CourseForm.jsx
import React, { useState } from 'react';

const CourseForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    category: initialData.category || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">{initialData.id ? 'Edit Course' : 'Add New Course'}</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-semibold mb-2">
          Course Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border py-2 px-3 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter course title"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-semibold mb-2">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border py-2 px-3 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter category"
        />
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {initialData.id ? 'Update Course' : 'Add Course'}
      </button>
    </form>
  );
};

export default CourseForm;
