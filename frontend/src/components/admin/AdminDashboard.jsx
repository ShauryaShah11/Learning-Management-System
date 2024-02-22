import { useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/userState";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const userStateValue = useRecoilValue(userState);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(userStateValue.role !== 'admin' || !userStateValue.isLoggedIn){
      navigate('/login');    
    }
  }, [])
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* Add admin-specific content and features here */}
    </div>
  );
};

export default AdminDashboard;
