// Layout.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/Signup';

function Layout() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;