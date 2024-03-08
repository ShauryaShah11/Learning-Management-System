import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-auto lg:h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-5 text-2xl font-semibold border-b border-gray-700">Tutor Panel</div>
      <nav className="flex flex-col p-5 border-b border-gray-700">
        <NavLink to="/tutor" className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white">Dashboard</NavLink>
        <NavLink to="/tutor/courses" className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white">Courses</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;