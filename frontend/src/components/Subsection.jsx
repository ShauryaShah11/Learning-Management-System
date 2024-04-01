import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Document, Page, pdfjs } from "react-pdf";

function Subsection({ section, subsections }) {
    const [isVideoReady, setIsVideoReady] = useState({});
    const [pdfLoading, setPdfLoading] = useState({});
    const [showVideoPlayer, setShowVideoPlayer] = useState({});
    const [showPdf, setShowPdf] = useState({});
    const [showImage, setShowImage] = useState({});

    useEffect(() => {
        // Update PDF worker path to load PDF properly
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }, []);

    const handleVideoReady = (subsectionId) => {
        setIsVideoReady((prev) => ({ ...prev, [subsectionId]: true }));
    };

    const handlePdfLoadSuccess = (subsectionId) => {
        setPdfLoading((prev) => ({ ...prev, [subsectionId]: false }));
    };

    const handleTitleClick = (subsectionId, type) => {
        // Reset all show states
        setShowVideoPlayer({});
        setShowPdf({});
        setShowImage({});

        // Set show state for clicked subsection
        if (type === "videos") {
            setShowVideoPlayer((prev) => ({ ...prev, [subsectionId]: true }));
        } else if (type === "pdf") {
            setShowPdf((prev) => ({ ...prev, [subsectionId]: true }));
        } else if (type === "images") {
            setShowImage((prev) => ({ ...prev, [subsectionId]: true }));
        }
    };

    return (
        <>
            <div className="max-h-80 overflow-y-auto subparts">
                {subsections.map((subsection) => (
                    <div
                        key={subsection._id}
                        className="flex justify-between items-center py-3 border-b border-gray-200 transition duration-300 ease-in-out transform hover:bg-gray-100"
                        onClick={() =>
                            handleTitleClick(subsection._id, subsection.type)
                        }
                        style={{ cursor: "pointer" }}
                    >
                        <div className="flex items-center">
                            <input
                                className="form-checkbox rounded-sm text-blue-500 focus:ring-2 focus:ring-blue-500"
                                type="checkbox"
                                id={`flexCheckDefault_${section}_${subsection._id}`}
                            />
                            <label
                                className="ml-3 cursor-pointer text-gray-700"
                                htmlFor={`flexCheckDefault_${section}_${subsection._id}`}
                            >
                                {subsection.title} - {subsection.type}{" "}
                                {/* Display subsection type */}
                            </label>
                        </div>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.707 3.293a1 1 0 0 1 1.414 0L8 5.586l2.293-2.293a1 1 0 1 1 1.414 1.414L9.414 7l2.293 2.293a1 1 0 1 1-1.414 1.414L8 8.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L6.586 7 4.293 4.707a1 1 0 0 1 0-1.414z"
                                />
                            </svg>
                            <div className="text-gray-500">{`${subsection.duration} min`}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="underline border-b border-gray-200"></div>

            {subsections.map((subsection) => (
                <React.Fragment key={subsection._id}>
                    {subsection.type === "videos" &&
                        showVideoPlayer[subsection._id] && (
                            <div className="player-wrapper mt-4">
                                <ReactPlayer
                                    url={subsection.url}
                                    controls
                                    width="100%"
                                    height="400px"
                                    onReady={() =>
                                        handleVideoReady(subsection._id)
                                    }
                                />
                                {!isVideoReady[subsection._id] && (
                                    <div className="flex justify-center mt-4">
                                        Loading...
                                    </div>
                                )}
                            </div>
                        )}

                    {subsection.type === "pdf" && showPdf[subsection._id] && (
                        <div className="pdf-wrapper mt-4">
                            <Document
                                file={subsection.url}
                                onLoadSuccess={() =>
                                    handlePdfLoadSuccess(subsection._id)
                                }
                            >
                                <Page pageNumber={1} width={400} />
                            </Document>
                            {pdfLoading[subsection._id] && (
                                <div className="flex justify-center mt-4">
                                    Loading PDF...
                                </div>
                            )}
                        </div>
                    )}

                    {subsection.type === "images" &&
                        showImage[subsection._id] && (
                            <div className="image-wrapper mt-4">
                                <img
                                    src={subsection.url}
                                    alt="Subsection Image"
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                        imageRendering: "auto", // Improve rendering quality
                                        objectFit: "contain", // Maintain aspect ratio without distortion
                                    }}
                                />
                            </div>
                        )}
                </React.Fragment>
            ))}
        </>
    );
}

export default Subsection;
