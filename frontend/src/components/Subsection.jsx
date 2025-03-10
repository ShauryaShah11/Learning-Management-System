import React, { useState } from "react";
import ReactPlayer from "react-player";
import PropTypes from "prop-types";
import PDFViewer from "./PDFViewer";
import ImageViewer from "./ImageViewer";

function Subsection({ section, subsections }) {
    const [showContent, setShowContent] = useState({});
    const [activeSubsection, setActiveSubsection] = useState(null);

    // Toggle visibility of content for the clicked subsection
    const handleTitleClick = (subsectionId) => {
        // Close all other subsections
        const newState = {};
        subsections.forEach(sub => {
            newState[sub._id] = sub._id === subsectionId;
        });
        
        setShowContent(newState);
        setActiveSubsection(subsectionId);
    };

    // Format duration from seconds to MM:SS
    const formatDuration = (seconds) => {
        if (!seconds) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="ml-4 md:ml-10 mb-6 mt-2 border-l-2 border-gray-200 pl-4 md:pl-6">
            {/* List of Subsections */}
            <div className="mb-4">
                {subsections.map((subsection) => (
                    <div
                        key={subsection._id}
                        className={`flex justify-between items-center py-3 px-4 rounded-lg mb-2 transition-all duration-300 ease-in-out ${
                            activeSubsection === subsection._id 
                                ? 'bg-blue-50 border border-blue-200 shadow-md' 
                                : 'bg-white border border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                        } cursor-pointer`}
                        onClick={() => handleTitleClick(subsection._id)}
                    >
                        {/* Subsection Title and Type */}
                        <div className="flex items-center">
                            {/* Icon based on content type */}
                            <div className={`mr-3 w-10 h-10 flex items-center justify-center rounded-full ${
                                subsection.type === "videos" ? "bg-blue-100" : 
                                subsection.type === "pdf" ? "bg-red-100" : "bg-green-100"
                            }`}>
                                {subsection.type === "videos" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {subsection.type === "pdf" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {subsection.type === "images" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            
                            <div>
                                <div className="text-gray-900 font-medium leading-tight">{subsection.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                                    <span className="capitalize">{subsection.type === "videos" ? "Video" : subsection.type === "pdf" ? "Document" : "Image"}</span>
                                    {subsection.duration > 0 && (
                                        <>
                                            <span className="mx-1">•</span>
                                            <span>{formatDuration(subsection.duration)}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Status Icon */}
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                activeSubsection === subsection._id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                            }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${activeSubsection === subsection._id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render Content Based on Clicked Subsection */}
            {subsections.map((subsection) => (
                showContent[subsection._id] && (
                    <div key={`content-${subsection._id}`} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden animate-fadeIn">
                        {/* Content Header */}
                        <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">{subsection.title}</h3>
                        </div>
                        
                        {/* Content Body */}
                        <div className="p-5">
                            {/* Render Video Player */}
                            {subsection.type === "videos" && (
                                <div className="player-wrapper rounded-xl overflow-hidden shadow-lg">
                                    <ReactPlayer
                                        url={subsection.url}
                                        controls
                                        width="100%"
                                        height="500px"
                                        className="react-player"
                                        playing={true}
                                        config={{
                                            file: {
                                                attributes: {
                                                    controlsList: 'nodownload'
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Render Enhanced PDF Viewer */}
                            {subsection.type === "pdf" && (
                                <PDFViewer url={subsection.url} />
                            )}

                            {/* Render Enhanced Image Viewer */}
                            {subsection.type === "images" && (
                                <ImageViewer url={subsection.url} alt={subsection.title} />
                            )}
                        </div>
                        
                        {/* Content Footer */}
                        <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                {subsection.type === "videos" ? "Video Lecture" : subsection.type === "pdf" ? "PDF Document" : "Image Resource"}
                            </div>
                            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-300">
                                Mark as Complete
                            </button>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}

Subsection.propTypes = {
    section: PropTypes.string.isRequired,
    subsections: PropTypes.array.isRequired
};

export default Subsection;