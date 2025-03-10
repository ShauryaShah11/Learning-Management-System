import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
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
    }, [setCategories]);

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

    const handleInputChange = useCallback((event) => {
        const query = event.target.value;
        
        // Debounce implementation
        const timeoutId = setTimeout(() => {
            setSearchQuery(query);
        }, 1000);
        
        return () => clearTimeout(timeoutId);
    }, [setSearchQuery]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserStateValue({
                    isLoggedIn: true,
                    id: decoded.id,
                    role: decoded.role,
                });
            } catch (error) {
                console.error("Invalid token:", error);
                // Clear invalid token
                localStorage.removeItem("token");
            }
        }
    }, [setUserStateValue]);

    // Auth buttons component for better organization
    const AuthButtons = () => (
        <div className="flex items-center space-x-4">
            <Link
                to="/login"
                className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
                Sign In
            </Link>
            <Link
                to="/signup"
                className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
                Sign Up
            </Link>
        </div>
    );

    // User profile component
    const UserProfile = () => (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            >
                Profile
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <Link
                        to="/mycourses"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                        My Courses
                    </Link>
                    <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                        View Profile
                    </Link>
                    <button
                        onClick={logoutHandler}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white py-3 px-4 border-b shadow-sm">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-semibold text-blue-600">
                    <Link to="/" className="hover:text-blue-800 transition-colors duration-200">Knowledge Hive</Link>
                </div>

                {/* Search Bar */}
                <div className="hidden md:block flex-grow max-w-lg mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            onChange={handleInputChange}
                            placeholder="Search for courses..."
                            className="w-full bg-gray-50 border border-gray-300 rounded-full text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        to="/courses"
                        className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                    >
                        Courses
                    </Link>
                    <DropdownMenu categories={categories} title="Categories" />
                    <Link
                        to="/signup/tutor"
                        className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                    >
                        Become a Tutor
                    </Link>
                    
                    {userStateValue.isLoggedIn && userStateValue.role === "student" ? 
                        <UserProfile /> : 
                        <AuthButtons />
                    }
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <button 
                        onClick={toggleMenu}
                        className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        {isMenuOpen ? (
                            <XIcon className="h-6 w-6 text-gray-700" />
                        ) : (
                            <MenuIcon className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden mt-3">
                <input
                    type="text"
                    onChange={handleInputChange}
                    placeholder="Search for courses..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-full text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-3 pt-2 pb-3 border-t border-gray-200">
                    <div className="space-y-2 px-2">
                        <Link
                            to="/courses"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                        >
                            Courses
                        </Link>
                        <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
                            <DropdownMenu
                                categories={categories}
                                title="Categories"
                            />
                        </div>
                        <Link
                            to="/signup/tutor"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                        >
                            Become a Tutor
                        </Link>
                        
                        {userStateValue.isLoggedIn && userStateValue.role === "student" ? (
                            <>
                                <Link
                                    to="/mycourses"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                >
                                    My Courses
                                </Link>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                >
                                    View Profile
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 focus:outline-none"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 px-3 py-2">
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-4 py-2 text-center text-sm font-medium text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;