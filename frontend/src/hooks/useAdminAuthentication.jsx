import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../store/atoms/userState";
import { tokenAtom } from "../store/atoms/token";
import { jwtDecode } from "jwt-decode";

const useAdminAuthentication = () => {
    const [userStateValue, setUserStateValue] = useRecoilState(userState);
    const navigate = useNavigate();
    const [token , setToken] = useRecoilState(tokenAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if(storedToken){
            setToken(storedToken);
            const decoded = jwtDecode(storedToken);
            setUserStateValue({isLoggedIn: true, id: decoded.id, role: decoded.role});
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading && (userStateValue.role !== "admin" || !userStateValue.isLoggedIn || !token)) {
            navigate("/login");
        }
    }, [userStateValue, token, loading]);

};

export default useAdminAuthentication;