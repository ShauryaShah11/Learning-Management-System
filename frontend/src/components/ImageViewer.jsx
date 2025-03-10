import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

function ImageViewer({ url, alt }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const imageRef = useRef(null);

    // Zoom controls
    const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 4));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Fullscreen toggle
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        resetZoom();
    };

    // Handle mouse/touch events for dragging
    const handleMouseDown = (e) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 1 && scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y,
            });
        }
    };

    const handleTouchMove = (e) => {
        if (isDragging && e.touches.length === 1 && scale > 1) {
            setPosition({
                x: e.touches[0].clientX - dragStart.x,
                y: e.touches[0].clientY - dragStart.y,
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Handle image download
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = url;
        link.download = url.split("/").pop() || "image";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={`image-viewer ${
                isFullscreen
                    ? "fixed inset-0 z-50 bg-black bg-opacity-90 p-8"
                    : ""
            }`}
        >
            {/* Image Controls */}
            <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {/* Zoom Controls */}
                <div className="flex items-center space-x-2">
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

            {/* Image Display */}
            <div
                className={`relative overflow-hidden ${
                    isFullscreen ? "h-[80vh]" : "max-h-[500px]"
                } flex items-center justify-center border rounded-lg bg-gray-100`}
                style={{ cursor: scale > 1 ? "grab" : "default" }}
            >
                <img
                    ref={imageRef}
                    src={url}
                    alt={alt}
                    className={`max-w-full ${
                        isDragging ? "cursor-grabbing" : ""
                    } select-none`}
                    style={{
                        transform: `scale(${scale}) translate(${
                            position.x / scale
                        }px, ${position.y / scale}px)`,
                        transition: isDragging
                            ? "none"
                            : "transform 0.2s ease-out",
                    }}
                    draggable={false}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onDoubleClick={() => (scale === 1 ? zoomIn() : resetZoom())}
                />
                {scale > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                        Drag to pan • Double-click to reset
                    </div>
                )}
            </div>
        </div>
    );
}

ImageViewer.propTypes = {
    url: PropTypes.string.isRequired,
    alt: PropTypes.string,
};

ImageViewer.defaultProps = {
    alt: "Image",
};

export default ImageViewer;
