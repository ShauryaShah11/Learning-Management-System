import { useState } from "react";
import ReactPlayer from "react-player";
import { Document, Page } from "react-pdf";

function Subsection({ section, subsections, type, url }) {
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(true);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);

    const handleVideoReady = () => {
        setIsVideoReady(true);
    };

    const handlePdfLoadSuccess = () => {
        setPdfLoading(false);
    };

    const handleTitleClick = () => {
        if (type === "videos") {
            setShowVideoPlayer((prev) => !prev);
        }
    };

    return (
        <>
            <div className="max-h-80 overflow-y-auto subparts">
                {subsections.map((subsection) => (
                    <div
                        key={subsection._id}
                        className="flex justify-between items-center py-3 border-b border-gray-200 transition duration-300 ease-in-out transform hover:bg-gray-100"
                        onClick={handleTitleClick}
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
                                {subsection.title}
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

            {type === "videos" && (
                <div className="player-wrapper mt-4">
                    {showVideoPlayer && (
                        <ReactPlayer
                            url={url}
                            controls
                            width="100%"
                            height="400px"
                            onReady={handleVideoReady}
                        />
                    )}
                    {!isVideoReady && showVideoPlayer && (
                        <div className="flex justify-center mt-4">Loading...</div>
                    )}
                </div>
            )}

            {type !== "videos" && (
                <div className="pdf-wrapper mt-4">
                    <Document file={url} onLoadSuccess={handlePdfLoadSuccess}>
                        <Page pageNumber={1} width={400} />
                    </Document>
                    {pdfLoading && <div className="flex justify-center mt-4">Loading PDF...</div>}
                </div>
            )}
        </>
    );
}

export default Subsection;
