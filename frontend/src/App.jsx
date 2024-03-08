import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Layout/AdminLayout';
import TutorLayout from './components/Layout/TutorLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/tutor/*" element={<TutorLayout />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;