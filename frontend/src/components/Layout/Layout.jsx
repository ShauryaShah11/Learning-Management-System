import { Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar';
import HomePage from '../../pages/Home';
import LoginPage from '../../pages/Login';
import SignupPage from '../../pages/Signup';
import Footer from '../Footer';
import Category from '../../pages/Category';
import CourseCard from '../CourseCard';
import CourseDetails from '../../pages/CourseDetails';
import Profile from '../../pages/Profile';
import TutorDetils from '../../pages/TutorDetils';
import Course from '../../pages/Course';

function Layout() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tutor/:id" element={<TutorDetils />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;