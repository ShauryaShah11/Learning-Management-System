import { MailIcon, LockClosedIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { login } from '../services/authService';
import Loader from '../components/Loader';
import { useSetRecoilState } from 'recoil';
import { userState } from '../store/atoms/userState';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const setUserState = useSetRecoilState(userState);
    const [decodedToken, setDecodedToken] = useState(null);
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
            const token = response.token;

            if (token) {
                const decoded = jwtDecode(token);
                setDecodedToken(decoded);
                setUserState({
                    isLoggedIn: true,
                    role: decoded.role
                });
                setLoading(false);
                if(decoded.role === 'admin'){
                    navigate('/admin');
                }
            }
        } catch (error) {
            console.error("error", error);
            setLoading(false);
        }
    };

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
                    <Loader color="#00BFFF" loading={loading} size={10}/>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
