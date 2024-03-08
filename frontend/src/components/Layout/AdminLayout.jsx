import { Routes, Route } from "react-router-dom";
import Sidebar from "../admin/Sidebar";
import AdminDashboard from "../admin/AdminDashboard";
import AddCategoryForm from "../admin/AddCategoryform";
import AdminHeader from "../admin/Header";
import Footer from "../admin/Footer";
import EnrolledUsers from "../admin/EnrolledUsers";
import EditCourse from "../../pages/EditCourse";
import EditCategoryForm from "../../pages/admin/EditCategory";
import CourseList from "../../pages/admin/CourseList";
import CategoryList from "../../pages/admin/CategoryList";
import InstructorList from "../../pages/admin/InstructorList";
import EditInstructor from "../../pages/EditInstructor";
import UserList from "../../pages/admin/UserList";
import EditUser from "../../pages/admin/EditUser";

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-gray-200">
            <Sidebar className="bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out shadow-lg" />
            <div className="w-full flex flex-col h-screen overflow-y-auto">
                <AdminHeader className="w-full py-4 bg-blue-800 shadow-md text-white" />
                <div className="w-full overflow-x-hidden border-t flex flex-col flex-grow">
                    <main className="w-full p-6 flex-grow overflow-auto">
                        <Routes>
                            <Route path="/" element={<AdminDashboard />} />                    
                            <Route
                                path="/courses"
                                element={<CourseList />}
                            />                            
                            <Route
                                path="/courses/:id"
                                element={<EditCourse />}
                            />
                            <Route
                                path="/courses/:id/enroll"
                                element={<EnrolledUsers />}
                            />
                            <Route
                                path="/categories"
                                element={<CategoryList />}
                            />
                            <Route
                                path="/categories/add"
                                element={<AddCategoryForm />}
                            />
                            <Route
                                path="/categories/:id"
                                element={<EditCategoryForm />}
                            />   
                            <Route
                                path="/instructors"
                                element={<InstructorList />}
                            /> 
                            <Route
                                path="/instructors/:id"
                                element={<EditInstructor />}
                            />  
                            <Route
                                path="/users"
                                element={<UserList />}
                            /> 
                            <Route
                                path="/users/:id"
                                element={<EditUser />}
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
