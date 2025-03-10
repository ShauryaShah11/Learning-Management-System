import React, { useState, useEffect } from "react";
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

    // Fetch all courses only once when the component mounts
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

    // Fetch search results only when searchQuery is NOT empty
    useEffect(() => {
        if (searchQuery.trim() !== "") {
            const fetchSearchCoursesData = async () => {
                try {
                    setLoading(true);
                    const response = await fetchSearchCourses(searchQuery);
                    setSearchCourses(response);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSearchCoursesData();
        } else {
            // Reset searchCourses when searchQuery is empty
            setSearchCourses(null);
        }
    }, [searchQuery]);

    return (
        <>
            <HeroSection />
            <div className="mt-10">
                <div>
                    {searchQuery.trim() === "" ? (
                        <CourseCard courses={courses} loading={loading} />
                    ) : (
                        <CourseCard courses={searchCourses || []} loading={loading} />
                    )}
                </div>
            </div>
            <Testimonials />
        </>
    );
}

export default HomePage;
