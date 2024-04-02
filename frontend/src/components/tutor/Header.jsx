import { useRecoilState, useSetRecoilState } from "recoil";
import { logout } from "../../services/authService";
import { userState } from "../../store/atoms/userState";
import { userAtom } from "../../store/atoms/userAtom";
import { tokenAtom } from "../../store/atoms/token";

const Header = () => {
    const [userStateValue, setUserStateValue] = useRecoilState(userState);
    const setToken = useSetRecoilState(tokenAtom);
    const setUserData = useSetRecoilState(userAtom);
    const logoutHandler = async () => {
        try {
            logout();
            setToken(null);
            setUserData(null);
            setUserStateValue({ isLoggedIn: false, role: "guest" });
        } catch (error) {
            console.error("error", error);
        }
    };
    return (
        <header className="bg-light-blue p-4 flex justify-between items-center">
            <div className="text-white text-2xl font-bold capitalize">tutor Panel</div>
            <div className="flex items-center space-x-4">
                <div className="text-white capitalize">Welcome, tutor</div>
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

export default Header;
