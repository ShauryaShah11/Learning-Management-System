import { useRecoilState, useSetRecoilState } from "recoil";
import { logout } from "../../services/authService";
import { userState } from "../../store/atoms/userState";
import { tokenAtom } from "../../store/atoms/token";
import { userAtom } from "../../store/atoms/userAtom";
import { FiMenu } from "react-icons/fi"; // Importing FiMenu icon from react-icons
import { sidebarState } from "../../store/atoms/sidebar";

const AdminHeader = () => {
    const [userStateValue, setUserStateValue] = useRecoilState(userState);
    const setToken = useSetRecoilState(tokenAtom);
    const setUserData = useSetRecoilState(userAtom);
    const [isOpen, setIsOpen] = useRecoilState(sidebarState);

    const logoutHandler = async () => {
        try {
            logout();
            setToken(null);
            setUserData(null);
            setUserStateValue({ isLoggedIn: false, role: 'guest' });
        } catch (error) {
            console.error("error", error);
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Toggle sidebar state
    };

    return (
        <header className="bg-light-blue p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <button onClick={toggleSidebar} className="text-white text-2xl">
                    <FiMenu />
                </button>
                <div className="text-white text-xl font-bold">Welcome, Admin</div>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={logoutHandler}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;