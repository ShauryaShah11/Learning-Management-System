import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { SearchIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { fetchCategories } from "../services/apiService";
import DropdownMenu from "./DropdownMenu";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/userState";
import { logout } from "../services/authService";
import { categoryAtom } from "../store/atoms/category";
import { jwtDecode } from "jwt-decode";
import { tokenAtom } from "../store/atoms/token";
import { userAtom } from "../store/atoms/userAtom";
import { searchAtom } from "../store/atoms/searchAtom";

function Navbar() {
    const [categories, setCategories] = useRecoilState(categoryAtom);
    const [userStateValue, setUserStateValue] = useRecoilState(userState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef(null);
    const setToken = useSetRecoilState(tokenAtom);
    const [searchQuery, setSearchQuery] = useRecoilState(searchAtom);
    const [userData, setUserData] = useRecoilState(userAtom);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
            setToken(null);
            setUserData(null);
            setUserStateValue({ isLoggedIn: false, role: "guest" });
        } catch (error) {
            console.error("error", error);
        }
    };

    let debounceTimeout;

    const handleInputChange = (event) => {
        const query = event.target.value;

        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            setSearchQuery(query);
        }, 1000);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUserStateValue({
                isLoggedIn: true,
                id: decoded.id,
                role: decoded.role,
            });
        }
    }, []);

    return (
        <div className="bg-white p-4 border-b shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-md sm:text-black text-xl font-semibold">
                    <Link to="/">Knowledge Hive</Link>
                </div>

                <div className="relative mx-4">
                    <input
                        type="text"
                        onChange={handleInputChange}
                        placeholder="Search for courses..."
                        className="bg-gray-100 border border-gray-300 rounded-3xl text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 lg:w-96"
                    />
                    
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        to="/courses"
                        className="text-black hover:text-gray-500"
                    >
                        Courses
                    </Link>
                    <DropdownMenu categories={categories} title="Categories" />
                    <Link
                        to="/signup/tutor"
                        className="text-black hover:text-gray-500"
                    >
                        Become a tutor
                    </Link>
                    {userStateValue.isLoggedIn &&
                    userStateValue.role === "student" ? (
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="text-black hover:text-gray-500 focus:outline-none px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Profile
                            </button>
                            <div
                                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${
                                    isDropdownOpen ? "block" : "hidden"
                                }`}
                            >
                                <Link
                                    to="/mycourses"
                                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                                >
                                    My Courses
                                </Link>
                                <Link
                                    to="/profile"
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
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-black hover:text-gray-500 border p-2 shadow-inner rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="text-black bg-blue-500 hover:bg-blue-600 border px-4 py-2 rounded-md transition duration-300 text-white"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <XIcon className="h-6 w-6 text-black" />
                        ) : (
                            <MenuIcon className="h-6 w-6 text-black" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                        to="/courses"
                        className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-500"
                    >
                        Courses
                    </Link>
                    <div className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-500">
                        <DropdownMenu
                            categories={categories}
                            title="Categories"
                        />
                    </div>
                    <Link
                        to="/signup/tutor"
                        className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-500"
                    >
                        Become a tutor
                    </Link>
                    {userStateValue.isLoggedIn &&
                    userStateValue.role === "student" ? (
                        <>
                            <Link
                                to="/mycourses"
                                className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-500"
                            >
                                My Courses
                            </Link>
                            <Link
                                to="/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-500"
                            >
                                View Profile
                            </Link>
                            <button
                                onClick={logoutHandler}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-500 focus:outline-none"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-500"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-500"
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
