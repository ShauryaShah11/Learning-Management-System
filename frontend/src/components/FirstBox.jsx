import { useState } from "react";

function FirstBox({
    section,
    title,
    showSubparts,
    toggleSubparts,
    progress,
    timing,
}) {
    // Dummy data for subsections
    const dummySubsections = [
        {
            title: "Introduction to HTML",
            duration: "5:30",
        },
        {
            title: "Advanced CSS Techniques",
            duration: "8:45",
        },
        {
            title: "JavaScript Fundamentals",
            duration: "10:15",
        },
    ];

    return (
        <div className="w-full bg-white shadow-md rounded-md p-4 mb-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                        {section}
                    </div>
                    <div className="font-bold">{title}</div>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleSubparts}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform transform ${showSubparts ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="underline border-b border-gray-400 mt-4"></div>
        </div>
    );
}

export default FirstBox;

