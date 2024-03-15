import { Routes, Route } from "react-router-dom";
import Navbar from "../Navbar";
import HomePage from "../../pages/Home";
import LoginPage from "../../pages/Login";
import SignupPage from "../../pages/Signup";
import Footer from "../Footer";
import Category from "../../pages/Category";
import Profile from "../../pages/Profile";
import TutorDetils from "../../pages/TutorDetils";
import Course from "../../pages/Course";
import UserCourses from "../../pages/UserCourses";
import TutorSignupPage from "../../pages/tutor/Signup";
import CourseInformation from "../../pages/CourseInformation";
import CourseContent from "../../pages/CourseContent";

function Layout() {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto mb-10">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/category/:id" element={<Category />} />
                    <Route path="/course/:id" element={<CourseInformation />} />
                    <Route path="/courses" element={<Course />} />

                    <Route path="/profile" element={<Profile />} />
                    <Route
                        path="/courses/tutor/:id"
                        element={<TutorDetils />}
                    />
                    <Route path="/mycourses" element={<UserCourses />} />
                    <Route path="/signup/tutor" element={<TutorSignupPage />} />

                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
