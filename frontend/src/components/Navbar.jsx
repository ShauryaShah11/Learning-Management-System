import { Link } from "react-router-dom";
import { SearchIcon } from '@heroicons/react/outline';
import { useEffect, useState } from "react";
import { fetchCategories } from "../services/apiService";
import DropdownMenu from "./DropdownMenu";
import { useRecoilValue } from "recoil";
import { userState } from '../store/atoms/userState';

function Navbar(){
    const [categories, setCategories] = useState([]);
    const userStateValue = useRecoilValue(userState);
    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                const response = await fetchCategories();
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategoriesData();
    }, []);


    return (
        <div className="bg-white p-4 border border-custom-white shadow-inner mb-0">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-black text-lg font-semibold">
                    <Link to={'/'}>Knowledge Hive</Link>
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
                    <Link className="text-black hover:text-gray-300">Courses</Link>
                    <Link className="text-black hover:text-gray-300">Contact Us</Link>
                    <DropdownMenu categories={categories} title="categories"/>
                    {/* <Link className="text-black hover:text-gray-300">Categories</Link> */}
                </div>
                

                <div className="hidden md:flex flex items-center space-x-4">
                    {userStateValue.isLoggedIn && userStateValue.role === 'student' ? 
                        <div>
                            <Link to={'/profile'} className="text-black hover:text-gray-300">Profile</Link> 

                        </div>
                        :
                        <>
                            <Link to={'/login'} className="text-black hover:text-gray-300 border p-2 shadow-inner rounded-md">Sign In</Link>
                            <Link to={'/signup'} className="text-black bg-blue-500 hover:bg-blue-600 border px-4 py-2 rounded-md transition duration-300">Sign Up</Link>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default Navbar;