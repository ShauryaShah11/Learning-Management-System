import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/token";

const useToken = () => {
    const [token, setToken] = useRecoilState(tokenAtom);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken && storedToken !== token) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    return token;
};

export default useToken;
