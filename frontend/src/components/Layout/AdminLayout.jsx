import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../Loader";
import useAdminAuthentication from "../../hooks/useAdminAuthentication";

const LazySidebar = lazy(() => import("../admin/Sidebar"));
const LazyAdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const LazyAddCategoryForm = lazy(() => import("../admin/AddCategoryform"));
const LazyAdminHeader = lazy(() => import("../admin/Header"));
const LazyFooter = lazy(() => import("../admin/Footer"));
const LazyEnrolledUsers = lazy(() => import("../admin/EnrolledUsers"));
const LazyEditCourse = lazy(() => import("../../pages/EditCourse"));
const LazyEditCategoryForm = lazy(() => import("../../pages/admin/EditCategory"));
const LazyCourseList = lazy(() => import("../../pages/admin/CourseList"));
const LazyCategoryList = lazy(() => import("../../pages/admin/CategoryList"));
const LazyInstructorList = lazy(() => import("../../pages/admin/InstructorList"));
const LazyEditInstructor = lazy(() => import("../../pages/EditInstructor"));
const LazyUserList = lazy(() => import("../../pages/admin/UserList"));
const LazyEditUser = lazy(() => import("../../pages/admin/EditUser"));


const AdminLayout = () => {
    useAdminAuthentication();
    return (
        <div className="flex h-screen bg-gray-200">
            <Suspense fallback={<Loader color="#00BFFF" size={20} />}>
                <LazySidebar className="bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out shadow-lg" />
                <div className="w-full flex flex-col h-screen overflow-y-auto">
                    <LazyAdminHeader className="w-full py-4 bg-blue-800 shadow-md text-white" />
                    <div className="w-full overflow-x-hidden border-t flex flex-col flex-grow">
                        <main className="w-full p-6 flex-grow overflow-auto">
                            <Routes>
                                <Route path="/" element={<LazyAdminDashboard />} />                    
                                <Route path="/courses" element={<LazyCourseList />} />                            
                                <Route path="/courses/:id" element={<LazyEditCourse />} />
                                <Route path="/courses/enroll/:id" element={<LazyEnrolledUsers />} />
                                <Route path="/categories" element={<LazyCategoryList />} />
                                <Route path="/categories/add" element={<LazyAddCategoryForm />} />
                                <Route path="/categories/:id" element={<LazyEditCategoryForm />} />   
                                <Route path="/instructors" element={<LazyInstructorList />} /> 
                                <Route path="/instructors/:id" element={<LazyEditInstructor />} />  
                                <Route path="/instructors/courses/:id" element={<LazyEditInstructor />} />  
                                <Route path="/users" element={<LazyUserList />} /> 
                                <Route path="/users/:id" element={<LazyEditUser />} />                     
                            </Routes>
                        </main>
                        <LazyFooter />
                    </div>
                </div>
            </Suspense>
        </div>
    );
};

export default AdminLayout;