import { useState } from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = ({ categories, title }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative z-50"> {/* Set z-index to 50 */}
            <button
                className="text-black hover:text-gray-300 focus:outline-none"
                onClick={toggleMenu}
            >
                <div className='capitalize'>{title}</div>
            </button>
            {isOpen && (
                <ul className="absolute top-full left-0 mt-8 bg-white opacity-75 border border-gray-300 rounded-md shadow-md w-64"> {/* Increased width */}
                    {categories.map((category) => (
                        <li key={category._id} className="py-3 px-6 hover:bg-gray-100 cursor-pointer">
                            <Link to={`/category/${category._id}`} className="block">{category.categoryName}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;
