import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Document, Page, pdfjs } from "react-pdf";

function Subsection({ section, subsections }) {
    const [showContent, setShowContent] = useState({});

    // Initialize PDF worker path
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    // Toggle visibility of content for the clicked subsection
    const handleTitleClick = (subsectionId) => {
        setShowContent((prev) => ({
            ...prev,
            [subsectionId]: !prev[subsectionId],
        }));
    };

    return (
        <>
            {/* List of Subsections */}
            <div className="max-h-80 overflow-y-auto subparts">
                {subsections.map((subsection) => (
                    <div
                        key={subsection._id}
                        className="flex justify-between items-center py-3 border-b border-gray-200 transition duration-300 ease-in-out transform hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleTitleClick(subsection._id)}
                    >
                        {/* Subsection Title and Type */}
                        <div className="flex items-center">
                            <label
                                htmlFor={`flexCheckDefault_${section}_${subsection._id}`}
                                className="ml-3 cursor-pointer text-gray-700"
                            >
                                {subsection.title} - {subsection.type}
                            </label>
                        </div>
                        {/* Duration and Toggle Icon */}
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-500 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                            <div className="text-gray-500">
                                {`${Math.floor(subsection.duration / 60)} mins`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider Line */}
            <div className="mt-4 border-b border-gray-200"></div>

            {/* Render Content Based on Clicked Subsection */}
            {subsections.map((subsection) => (
                <React.Fragment key={subsection._id}>
                    {showContent[subsection._id] && (
                        <div className="mt-4">
                            {/* Render Video Player */}
                            {subsection.type === "videos" && (
                                <div className="player-wrapper">
                                    <ReactPlayer
                                        url={subsection.url}
                                        controls
                                        width="100%"
                                        height="400px"
                                    />
                                </div>
                            )}

                            {/* Render PDF Viewer */}
                            {subsection.type === "pdf" && (
                                <div className="pdf-wrapper mt-4">
                                    <Document file={subsection.url}>
                                        <Page pageNumber={1} width={400} />
                                    </Document>
                                </div>
                            )}

                            {/* Render Image */}
                            {subsection.type === "images" && (
                                <div className="image-wrapper mt-4">
                                    <img
                                        src={subsection.url}
                                        alt="Subsection Image"
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            imageRendering: "auto",
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </>
    );
}

export default Subsection;
