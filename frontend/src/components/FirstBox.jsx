import React from "react";
import PropTypes from "prop-types";

function FirstBox({ section, title, showSubparts, toggleSubparts, progress, timing }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            {/* Header Section */}
            <div className="px-4 py-3 flex justify-between items-center cursor-pointer" onClick={toggleSubparts}>
                <div className="flex items-center space-x-3">
                    {/* Section Number */}
                    <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
                        {section}
                    </div>
                    {/* Title */}
                    <div className="text-lg font-semibold">{title}</div>
                </div>
                {/* Arrow Icon */}
                <div className={`transition-transform transform ${showSubparts ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            {/* Content Section (Visible when showSubparts is true) */}
            {showSubparts && (
                <div className="border-t border-gray-200 px-4 py-3">
                    {/* Progress and Timing Details */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-600">{progress}% Completed</div>
                        <div className="text-sm text-gray-500">{timing}</div>
                    </div>
                    {/* Divider Line */}
                    <div className="h-px bg-gray-200 w-full mb-3"></div>
                    {/* Additional content for subparts can be added here */}
                </div>
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
};

export default FirstBox;
