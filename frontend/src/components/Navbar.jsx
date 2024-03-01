import { Link } from "react-router-dom";
import { SearchIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { fetchCategories } from "../services/apiService";
import DropdownMenu from "./DropdownMenu";
import { useRecoilState } from "recoil";
import { userState } from "../store/atoms/userState";
import { logout } from "../services/authService";
import { categoryAtom } from "../store/atoms/category";

function Navbar() {
    const [categories, setCategories] = useRecoilState(categoryAtom);
    const [userStateValue, setUserStateValue] = useRecoilState(userState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                const response = await fetchCategories();
                setCategories(response);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategoriesData();
    }, []);

    const logoutHandler = async () => {
        try {
            logout();
            setUserStateValue({ isLoggedIn: false, role: null });
        } catch (error) {
            console.error("error", error);
        }
    };

    return (
        <div className="bg-white p-4 border border-custom-white shadow-inner mb-0">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-black text-lg font-semibold">
                    <Link to={"/"}>Knowledge Hive</Link>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="bg-gray-100 border border-gray-300 rounded-3xl text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 lg:w-96"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex space-x-6">
                    <Link
                        to={"/courses"}
                        className="text-black hover:text-gray-300"
                    >
                        Courses
                    </Link>
                    <Link className="text-black hover:text-gray-300">
                        Contact Us
                    </Link>
                    <DropdownMenu categories={categories} title="categories" />
                    {/* <Link className="text-black hover:text-gray-300">Categories</Link> */}
                </div>

                <div className="hidden md:flex flex items-center space-x-4">
                    {userStateValue.isLoggedIn &&
                    userStateValue.role === "student" ? (
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="text-black hover:text-gray-300 focus:outline-none px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Profile
                                </button>
                                <div
                                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${
                                        isDropdownOpen ? "block" : "hidden"
                                    }`}
                                >
                                    <Link
                                        to={"/mycourses"}
                                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                                    >
                                        My Courses
                                    </Link>
                                    <Link
                                        to={"/profile"}
                                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                                    >
                                        View Profile
                                    </Link>

                                    <button
                                        onClick={logoutHandler}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:outline-none"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                to={"/login"}
                                className="text-black hover:text-gray-300 border p-2 shadow-inner rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Sign In
                            </Link>
                            <Link
                                to={"/signup"}
                                className="text-black bg-blue-500 hover:bg-blue-600 border px-4 py-2 rounded-md transition duration-300 text-white"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
