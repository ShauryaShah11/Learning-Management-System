import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PropTypes from "prop-types";

// Initialize PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ url }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Handle document load success
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // Navigation controls
    const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () =>
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));

    // Zoom controls
    const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
    const resetZoom = () => setScale(1);

    // Rotation controls
    const rotateClockwise = () => setRotation((prev) => (prev + 90) % 360);

    // Fullscreen toggle
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Handle direct download
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = url;
        link.download = url.split("/").pop() || "document.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={`pdf-viewer ${
                isFullscreen ? "fixed inset-0 z-50 bg-white p-8" : ""
            }`}
        >
            {/* PDF Controls */}
            <div className="flex flex-wrap justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {/* Page Navigation */}
                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="px-3 py-1 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {pageNumber} of {numPages || "?"}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="px-3 py-1 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        Next
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <button
                        onClick={zoomOut}
                        className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <button
                        onClick={zoomIn}
                        className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={resetZoom}
                        className="px-2 py-1 text-xs rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        Reset
                    </button>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={rotateClockwise}
                        className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm5 10a1 1 0 01-1 1H3a1 1 0 01-1-1v-4a1 1 0 112 0v1.586l2.293-2.293a1 1 0 111.414 1.414L5.414 14H7a1 1 0 011 1zm7-10a1 1 0 01.707.293l2.293 2.293V5a1 1 0 112 0v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293A1 1 0 0115 4zm-.707 11.707a1 1 0 01-1.414 0L13.586 14H12a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0v-1.586l-2.293 2.293z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                        Download
                    </button>
                </div>
            </div>

            {/* PDF Document */}
            <div className="flex justify-center border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center justify-center h-96 p-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-red-500 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <p className="text-center text-gray-700">
                                Unable to load PDF from Cloudinary. <br />
                                <button
                                    onClick={handleDownload}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Download PDF Instead
                                </button>
                            </p>
                        </div>
                    }
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        rotate={rotation}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={
                            isFullscreen
                                ? undefined
                                : Math.min(800, window.innerWidth - 40)
                        }
                        className="mx-auto"
                    />
                </Document>
            </div>
        </div>
    );
}

PDFViewer.propTypes = {
    url: PropTypes.string.isRequired,
};

export default PDFViewer;
