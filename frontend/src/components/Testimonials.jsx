import React from "react";

const testimonialsData = [
    {
        name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        feedback:
            "This platform has transformed the way I learn. Highly recommended!",
    },
    {
        name: "Jane Smith",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        feedback:
            "An excellent resource for anyone looking to improve their skills.",
    },
    {
        name: "Samuel Lee",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        feedback:
            "The courses are well-structured and easy to follow. A great learning experience.",
    },
];

const Testimonials = () => {
    return (
        <div className="bg-gray-100 py-12 mt-4">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold text-center mb-8">
                    What Our Users Say
                </h2>
                <div className="flex flex-wrap justify-center">
                    {testimonialsData.map((testimonial, index) => (
                        <div
                            key={index}
                            className="w-full md:w-1/3 lg:w-1/4 p-4"
                        >
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-16 h-16 rounded-full mx-auto mb-4"
                                />
                                <h3 className="text-xl font-semibold text-center">
                                    {testimonial.name}
                                </h3>
                                <p className="text-gray-600 text-center mt-4">
                                    "{testimonial.feedback}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
