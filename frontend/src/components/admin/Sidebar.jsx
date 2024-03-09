import { NavLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="h-auto lg:h-screen bg-gray-800 text-white flex flex-col">
            <div className="p-5 text-2xl font-semibold border-b border-gray-700">
                Admin Panel
            </div>
            <nav className="flex flex-col p-5 border-b border-gray-700">
                <NavLink
                    to="/admin"
                    className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    Admin Dashboard
                </NavLink>
                <NavLink
                    to="/admin/instructors"
                    className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    Instrauctor
                </NavLink>
                <NavLink
                    to="/admin/courses"
                    className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    Courses
                </NavLink>
                <NavLink
                    to="/admin/categories"
                    className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    Categories
                </NavLink>
                <NavLink
                    to="/admin/users"
                    className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    Students
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
