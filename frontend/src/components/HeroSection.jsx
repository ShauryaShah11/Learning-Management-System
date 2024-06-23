import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <div className="relative bg-gradient-to-b from-blue-900 to-blue-600 overflow-hidden">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="relative sm:mx-auto sm:max-w-3xl">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white">
                            Your Learning Journey Starts Here
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl text-white">
                            Explore courses, enhance your skills, and achieve your goals with our online learning platform.
                        </p>
                        <div className="mt-8 sm:mt-10">
                            <Link
                                to={"/courses"}
                                className="inline-block bg-white border border-transparent rounded-md py-3 px-6 text-base font-medium text-blue-600 hover:bg-blue-50 sm:w-auto"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
