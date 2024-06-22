import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { sidebarState } from "../../store/atoms/sidebar";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useRecoilState(sidebarState);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <div
            className={`lg:flex lg:flex-row lg:min-h-screen ${
                isOpen ? "overflow-hidden" : ""
            }`}
        >
            {/* Sidebar */}
            <nav
                className={`fixed inset-y-0 left-0 bg-gray-800 w-64 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-200 ease-in-out shadow-lg z-50 lg:relative lg:translate-x-0 lg:shadow-none`}
            >
                <div className="flex flex-col justify-between h-screen p-5 border-b border-gray-700">
                    <div>
                        <h2 className="mb-4 text-xl font-semibold">Menu</h2>
                        <div className="space-y-2">
                            <NavLink
                                to="/tutor"
                                className="block p-3 text-lg rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
                                activeClassName="bg-gray-700"
                                onClick={closeSidebar}
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/tutor/courses"
                                className="block p-3 text-lg rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
                                activeClassName="bg-gray-700"
                                onClick={closeSidebar}
                            >
                                Courses
                            </NavLink>
                        </div>
                    </div>
                    {/* Line separating items */}
                    <hr className="my-4 border-t border-gray-700" />
                    {/* Additional content can be added below the line */}
                </div>
            </nav>

  
            {/* Overlay for closing sidebar on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={closeSidebar}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;
