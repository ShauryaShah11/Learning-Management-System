import { useRecoilState } from 'recoil';
import { logout } from '../../services/authService';
import { userState } from '../../store/atoms/userState';

const AdminHeader = () => {
  const [userStateValue, setUserStateValue] = useRecoilState(userState);

    const logoutHandler = async () => {
      try {
        logout();       
        setUserStateValue({isLoggedIn: false, role: null}); 
      } catch (error) {
        console.error("error", error);
      }
    }
     return (
      <header className="bg-light-blue p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Admin Panel</div>
        <div className="flex items-center space-x-4">
          <div className="text-white">Welcome, Admin</div>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </header>
    );
  };
  
  export default AdminHeader;