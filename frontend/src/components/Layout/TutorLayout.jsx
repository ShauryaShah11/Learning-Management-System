import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import useTutorAuthentication from "../../hooks/useTutorAuthentication";

const LazySidebar = lazy(() => import("../tutor/Sidebar"));
const LazyHeader = lazy(() => import("../tutor/Header"));
const LazyFooter = lazy(() => import("../admin/Footer"));
const LazyCourseList = lazy(() => import("../../pages/tutor/CourseList"));
const LazyAddCourse = lazy(() => import("../../pages/AddCourse"));
const LazyEditCourse = lazy(() => import("../../pages/EditCourse"));
const LazyEnrolledUsers = lazy(() => import("../admin/EnrolledUsers"));

const TutorLayout = () => {
    useTutorAuthentication();
    return (
        <div className="flex h-screen bg-gray-200">
            <Suspense fallback={<div>Loading...</div>}>
                <LazySidebar className="bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out" />
                <div className="w-full flex flex-col h-screen overflow-y-auto">
                    <LazyHeader className="w-full py-4 bg-blue-800 shadow-md text-white" />
                    <div className="w-full overflow-x-hidden border-t flex flex-col flex-grow">
                        <main className="w-full p-6 flex-grow">
                            <Routes>
                                <Route path="/courses" element={<LazyCourseList />} />
                                <Route path="/courses/add" element={<LazyAddCourse />} />
                                <Route path="/courses/:id" element={<LazyEditCourse />} />
                                <Route path="/courses/enroll/:id" element={<LazyEnrolledUsers />} />
                            </Routes>
                        </main>
                        <LazyFooter />
                    </div>
                </div>
            </Suspense>
        </div>
    );
};

export default TutorLayout;