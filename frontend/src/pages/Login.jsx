import { MailIcon, LockClosedIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { login } from "../services/authService";
import Loader from "../components/Loader";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/userState";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { tokenAtom } from "../store/atoms/token";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const setToken = useSetRecoilState(tokenAtom);
    const [loading, setLoading] = useState(false);
    const setUserStateValue = useSetRecoilState(userState);
    const navigate = useNavigate();
    const changeHandler = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await login(formData.email, formData.password);
            if (response.token) {
                toast.success("Login successful");
                const token = `Bearer ${response.token}`;
                localStorage.setItem("token", token);
                setToken(token);
                const decoded = jwtDecode(response.token);
                setUserStateValue({
                    isLoggedIn: true,
                    id: decoded.id,
                    role: decoded.role,
                });
                if (decoded.role === "admin") {
                    navigate("/admin");
                }
                if (decoded.role === "tutor") {
                    navigate("/tutor");
                }
            }
            setLoading(false);
        } catch (error) {
            toast.error("Email or password is incorrect");
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
            const decoded = jwtDecode(token);
            setUserStateValue({
                isLoggedIn: true,
                id: decoded.id,
                role: decoded.role,
            });
        }
    }, []);

    return (
        <div className="flex flex-col mt-20 justify-center items-center bg-white">
            <div className="text-3xl mb-6 text-center font-bold">Log In</div>
            <div className="w-80 bg-white rounded-lg shadow-md p-6">
                <div className="mb-4 flex items-center border-b border-gray-300">
                    <MailIcon className="h-6 w-6 mr-3 text-gray-600" />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={changeHandler}
                        className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none"
                    />
                </div>
                <div className="mb-6 flex items-center border-b border-gray-300">
                    <LockClosedIcon className="h-6 w-6 mr-3 text-gray-600" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={changeHandler}
                        className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    onClick={submitHandler}
                    className="w-full py-2 px-3 text-white rounded-lg bg-blue-500 shadow-lg hover:bg-blue-600 focus:outline-none"
                >
                    Log In
                </button>
                <div className="mt-5">
                    <Loader color="#00BFFF" loading={loading} size={10} />
                </div>
            </div>
            <div className="mt-6 text-gray-600 text-sm">
                <p>
                    <span className="font-semibold">Demo email:</span> john@gmail.com
                </p>
                <p>
                    <span className="font-semibold">Password:</span> john@1234
                </p>
            </div>
        </div>

    );
}

export default LoginPage;
