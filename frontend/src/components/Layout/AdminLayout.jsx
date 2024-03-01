import { Routes, Route } from "react-router-dom";
import Sidebar from "../admin/sidebar";
import AdminDashboard from "../admin/AdminDashboard";
import AdminManagement from "../admin/AdminManagement";
import ManageInstructors from "../admin/ManageInstructor";
import ManageStudents from "../admin/ManageStudents";
import CourseForm from "../admin/courseform";
import AddCategoryForm from "../admin/AddCategoryform";
import AddInstructorForm from "../admin/AddInstructerform";
import AddStudentForm from "../admin/AddStudentform";
import AdminHeader from "../admin/Header";
import Footer from "../admin/Footer";
import EnrolledUsers from "../admin/EnrolledUsers";
import EditCourse from "../../pages/admin/EditCourse";
import ManageCourses from "../../pages/admin/ManageCourses";
import ManageCategories from "../../pages/admin/ManageCategories";

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-gray-200">
            <Sidebar className="bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out" />
            <div className="w-full flex flex-col h-screen overflow-y-auto">
                <AdminHeader className="w-full py-4 bg-blue-800 shadow-md text-white" />
                <div className="w-full overflow-x-hidden border-t flex flex-col flex-grow">
                    <main className="w-full p-6 flex-grow">
                        <Routes>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route
                                path="/admin-management"
                                element={<AdminManagement />}
                            />
                            <Route
                                path="/instructor"
                                element={<ManageInstructors />}
                            />
                            <Route path="/course" element={<ManageCourses />} />
                            <Route
                                path="/category"
                                element={<ManageCategories />}
                            />
                            <Route
                                path="/student"
                                element={<ManageStudents />}
                            />
                            <Route path="/addcourse" element={<CourseForm />} />
                            <Route
                                path="/editcourse/:id"
                                element={<EditCourse />}
                            />
                            <Route
                                path="/addcategory"
                                element={<AddCategoryForm />}
                            />
                            <Route
                                path="/addstudent"
                                element={<AddStudentForm />}
                            />
                            <Route
                                path="/addInstructor"
                                element={<AddInstructorForm />}
                            />
                            <Route
                                path="/addInstructor"
                                element={<AddInstructorForm />}
                            />
                            <Route
                                path="/enroll/:id"
                                element={<EnrolledUsers />}
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
