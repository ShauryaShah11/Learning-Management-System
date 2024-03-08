import { Routes, Route } from "react-router-dom";
import Sidebar from "../tutor/Sidebar";
import Header from "../tutor/Header";
import Footer from "../admin/Footer";
import CourseList from "../../pages/tutor/CourseList";
import AddCourse from "../../pages/AddCourse";
import EditCourse from "../../pages/EditCourse";

const TutorLayout = () => {
    return (
        <div className="flex h-screen bg-gray-200">
            <Sidebar className="bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out" />
            <div className="w-full flex flex-col h-screen overflow-y-auto">
                <Header className="w-full py-4 bg-blue-800 shadow-md text-white" />
                <div className="w-full overflow-x-hidden border-t flex flex-col flex-grow">
                    <main className="w-full p-6 flex-grow">
                        <Routes>
                            <Route
                                path="/courses"
                                element={<CourseList />}
                            />
                            <Route
                                path="/courses/add"
                                element={<AddCourse />}
                            />
                            <Route
                                path="/courses/:id"
                                element={<EditCourse />}
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default TutorLayout;
