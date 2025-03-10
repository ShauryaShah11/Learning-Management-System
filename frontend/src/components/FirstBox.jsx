import React from "react";
import PropTypes from "prop-types";

function FirstBox({ section, title, showSubparts, toggleSubparts, progress, timing, isActive }) {
    return (
        <div 
            className={`bg-white rounded-xl shadow-md overflow-hidden mb-5 transition-all duration-300 
                ${isActive 
                    ? 'border-l-4 border-blue-500 shadow-blue-100' 
                    : 'border-l-4 border-transparent hover:border-blue-200'}`}
        >
            {/* Header Section */}
            <div 
                className={`px-6 py-5 flex flex-wrap md:flex-nowrap justify-between items-center cursor-pointer
                    ${isActive ? 'bg-gradient-to-r from-blue-50 to-white' : 'bg-white hover:bg-gray-50'}`}
                onClick={toggleSubparts}
            >
                <div className="flex items-center space-x-4 w-full md:w-auto mb-3 md:mb-0">
                    {/* Section Number */}
                    <div className={`
                        relative flex items-center justify-center 
                        w-12 h-12 rounded-full shadow-md
                        ${isActive 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                            : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'}
                        `}
                    >
                        <span className="text-lg font-bold">{section}</span>
                        {isActive && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                    
                    {/* Title */}
                    <div className="flex-grow">
                        <h3 className={`text-lg font-semibold tracking-tight 
                            ${isActive ? 'text-blue-800' : 'text-gray-800'}`}>
                            {title}
                        </h3>
                        <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500 font-medium">{timing}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between w-full md:w-auto">
                    {/* Progress Indicator */}
                    <div className="flex flex-col md:mr-6">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 font-medium">Progress</span>
                            <span className={`text-xs font-semibold ${progress >= 70 ? 'text-green-600' : 'text-blue-600'}`}>
                                {progress}%
                            </span>
                        </div>
                        <div className="relative w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                                    progress >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                }`}
                                style={{ width: `${progress}%` }} 
                            />
                        </div>
                    </div>
                    
                    {/* Toggle Button */}
                    <div className={`
                        flex items-center justify-center h-10 w-10 rounded-full 
                        transition-all duration-300 ease-in-out
                        ${showSubparts
                            ? 'bg-blue-100 rotate-0' 
                            : 'bg-gray-100 hover:bg-blue-50'}
                    `}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 transition-transform duration-300 ease-in-out ${
                                showSubparts 
                                ? 'text-blue-600 rotate-180' 
                                : 'text-gray-600'
                            }`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            
            {/* Visual indicator for expanded state */}
            {showSubparts && (
                <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            )}
        </div>
    );
}

// PropTypes for type checking
FirstBox.propTypes = {
    section: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    showSubparts: PropTypes.bool.isRequired,
    toggleSubparts: PropTypes.func.isRequired,
    progress: PropTypes.number.isRequired,
    timing: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
};

FirstBox.defaultProps = {
    isActive: false
};

export default FirstBox;