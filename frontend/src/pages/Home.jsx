import React from "react";
import { useState, useEffect } from "react";
import { fetchCourses, fetchSearchCourses } from "../services/apiService";
import CourseCard from "../components/CourseCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { courseAtom } from "../store/atoms/course";
import { searchAtom } from "../store/atoms/searchAtom";
import HeroSection from "../components/HeroSection";
import Testimonials from "../components/Testimonials";

function HomePage() {
    const [courses, setCourses] = useRecoilState(courseAtom);
    const [searchCourses, setSearchCourses] = useState(null);
    const [loading, setLoading] = useState(false);
    const searchQuery = useRecoilValue(searchAtom);

    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                setLoading(true);
                const response = await fetchCourses();
                setCourses(response);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoursesData();
    }, [setCourses]);

    useEffect(() => {
        const fetchSearchCoursesData = async () => {
            try {
                setLoading(true);
                const response = await fetchSearchCourses(searchQuery);
                setSearchCourses(response);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSearchCoursesData();
    }, [searchQuery, setCourses]);

    return (
        <>
            <HeroSection />
            <div className="mt-10">
                <div className="text-xl sm:text-3xl font-bold">Recommended for you</div>
                <div>
                    {searchQuery === '' ? (
                        <CourseCard courses={courses} loading={loading} />
                    ) : (
                        <CourseCard courses={searchCourses} loading={loading} />
                    )}
                </div>
            </div>
            <Testimonials />
        </>
    );
}

export default HomePage;
