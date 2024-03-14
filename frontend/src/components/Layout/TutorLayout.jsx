import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import useTutorAuthentication from "../../hooks/useTutorAuthentication";
import Loader from "../Loader";
import EditSection from "../tutor/EditSection";

const LazyTutorDashboard = lazy(() => import("../tutor/TutorDashboard"));
const LazySidebar = lazy(() => import("../tutor/Sidebar"));
const LazyHeader = lazy(() => import("../tutor/Header"));
const LazyFooter = lazy(() => import("../admin/Footer"));
const LazyCourseList = lazy(() => import("../../pages/tutor/CourseList"));
const LazyAddCourse = lazy(() => import("../../pages/AddCourse"));
const LazyEditCourse = lazy(() => import("../../pages/EditCourse"));
const LazyEnrolledUsers = lazy(() => import("../admin/EnrolledUsers"));
const LazyAddSection = lazy(() => import("../tutor/addSection"));
const LazyAddSubSection = lazy(() => import("../tutor/addSubSection"));
const LazySectionList = lazy(() => import("../../pages/tutor/SectionList"));
const LazySubSectionList = lazy(() => import("../../pages/tutor/SubSectionList"));
const LazyEditSubSection = lazy(() => import("../tutor/EditSubSection"));

const TutorLayout = () => {
    useTutorAuthentication();
    return (
        <div className="flex h-screen bg-gray-200">
            <Suspense fallback={<Loader color="#00BFFF" size={20} />}>
                <LazySidebar className="bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out" />
                <div className="w-full flex flex-col h-screen overflow-y-auto">
                    <LazyHeader className="w-full py-4 bg-blue-800 shadow-md text-white" />
                    <div className="w-full overflow-x-hidden border-t flex flex-col flex-grow">
                        <main className="w-full p-6 flex-grow">
                            <Routes>
                                <Route
                                    path="/"
                                    element={<LazyTutorDashboard />}
                                />

                                <Route
                                    path="/courses"
                                    element={<LazyCourseList />}
                                />
                                <Route
                                    path="/courses/add"
                                    element={<LazyAddCourse />}
                                />
                                <Route
                                    path="/courses/:id"
                                    element={<LazyEditCourse />}
                                />
                                <Route
                                    path="/courses/enroll/:id"
                                    element={<LazyEnrolledUsers />}
                                />
                                <Route
                                    path="/section/add/:id"
                                    element={<LazyAddSection />}
                                />
                                <Route
                                    path="/section/edit/:id"
                                    element={<EditSection />}
                                />
                                <Route
                                    path="/section/:id"
                                    element={<LazySectionList />}
                                />
                                <Route
                                    path="/subsection/:id"
                                    element={<LazySubSectionList />}
                                />
                                <Route
                                    path="/subsection/add/:id"
                                    element={<LazyAddSubSection />}
                                />
                                <Route
                                    path="/subsection/edit/:id"
                                    element={<LazyEditSubSection />}
                                />
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
