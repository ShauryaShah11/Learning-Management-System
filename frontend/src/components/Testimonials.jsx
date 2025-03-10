import React, { useState, useEffect } from "react";

const testimonialsData = [
    {
        name: "John Doe",
        role: "Software Developer",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        feedback: "This platform has transformed the way I learn. The courses are comprehensive and the instructors are incredibly knowledgeable. Highly recommended!",
        rating: 5,
        course: "Advanced JavaScript"
    },
    {
        name: "Jane Smith",
        role: "UX Designer",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        feedback: "An excellent resource for anyone looking to improve their skills. The platform is intuitive and the content is top-notch.",
        rating: 5,
        course: "UI/UX Fundamentals"
    },
    {
        name: "Samuel Lee",
        role: "Data Scientist",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        feedback: "The courses are well-structured and easy to follow. I've been able to apply what I've learned directly to my work. A great learning experience.",
        rating: 4,
        course: "Python for Data Science"
    },
    {
        name: "Maria Rodriguez",
        role: "Product Manager",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        feedback: "The quality of instruction is outstanding. I've taken several courses and each one has exceeded my expectations.",
        rating: 5,
        course: "Product Management Essentials"
    }
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => 
                current === testimonialsData.length - 1 ? 0 : current + 1
            );
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    // Generate star rating
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <svg 
                key={i} 
                className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600 rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600 rounded-full opacity-5 translate-x-1/3 translate-y-1/3"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Section heading */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Students Say
                        </h2>
                        <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
                        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover how our courses have helped students transform their skills and advance their careers.
                        </p>
                    </div>
                    
                    {/* Testimonial slider */}
                    <div className="relative">
                        {/* Large quote icon */}
                        <div className="absolute -top-10 left-0 text-indigo-200 opacity-50" style={{ fontSize: '160px', lineHeight: '1', zIndex: '-1' }}>
                            "
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative">
                            <div className="flex flex-col md:flex-row md:items-center">
                                {/* User image and info for medium+ screens */}
                                <div className="md:w-1/3 mb-8 md:mb-0 md:pr-8">
                                    <div className="flex flex-col items-center md:items-start">
                                        <div className="w-24 h-24 rounded-full border-4 border-indigo-50 overflow-hidden shadow-lg mb-4">
                                            <img 
                                                src={testimonialsData[activeIndex].image} 
                                                alt={testimonialsData[activeIndex].name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">{testimonialsData[activeIndex].name}</h3>
                                        <p className="text-indigo-600 font-medium">{testimonialsData[activeIndex].role}</p>
                                        <p className="text-sm text-gray-500 mt-1">Student of {testimonialsData[activeIndex].course}</p>
                                        <div className="flex items-center mt-3">
                                            {renderStars(testimonialsData[activeIndex].rating)}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Testimonial content */}
                                <div className="md:w-2/3 md:border-l md:border-gray-100 md:pl-8">
                                    <p className="text-gray-700 text-lg leading-relaxed italic mb-6">
                                        "{testimonialsData[activeIndex].feedback}"
                                    </p>
                                    
                                    {/* Navigation dots */}
                                    <div className="flex justify-center md:justify-start space-x-2 mt-8">
                                        {testimonialsData.map((_, index) => (
                                            <button 
                                                key={index}
                                                onClick={() => setActiveIndex(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                    index === activeIndex 
                                                    ? 'bg-indigo-600 w-8' 
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                                aria-label={`Go to testimonial ${index + 1}`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Navigation arrows */}
                        <div className="hidden md:block">
                            <button 
                                className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                onClick={() => setActiveIndex((current) => current === 0 ? testimonialsData.length - 1 : current - 1)}
                                aria-label="Previous testimonial"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                onClick={() => setActiveIndex((current) => current === testimonialsData.length - 1 ? 0 : current + 1)}
                                aria-label="Next testimonial"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;