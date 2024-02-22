import { NavLink } from 'react-router-dom';

const sidebar = () => {
  return (
    <div className="h-auto lg:h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-5 text-2xl font-semibold border-b border-gray-700">Admin Panel</div>
      <nav className="flex flex-col p-5 border-b border-gray-700">
        <NavLink to="/admin" className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white">Admin Dashboard</NavLink>
        <NavLink to="/admin/admin-management" className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white">Admin Management</NavLink>
        <NavLink to="/admin/instructor" className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white">Instructors</NavLink>
        <NavLink to="/admin/course" className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white">Courses</NavLink>
        <NavLink to="/admin/category" className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white">Categories</NavLink>
        <NavLink to="/admin/student" className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white">Students</NavLink>       
        {/* Add more navigation links as needed */}
      </nav>
    </div>
  );
};

export default sidebar;