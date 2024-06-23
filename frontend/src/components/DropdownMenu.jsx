import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = ({ categories, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                className="text-black hover:text-gray-700 focus:outline-none"
                onClick={toggleMenu}
            >
                <div className="capitalize">{title}</div>
            </button>
            {isOpen && (
                <ul className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md w-64">
                    {categories.map((category) => (
                        <li key={category._id} className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                            <Link to={`/category/${category._id}`} className="block">
                                {category.categoryName}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;
