import { MailIcon, LockClosedIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { login } from '../services/authService';
import { SyncLoader } from "react-spinners";
import Loader from '../components/Loader';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const changeHanlder = (e) => {
        setFormData((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
        console.log("hello")
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => {
            login(formData.email, formData.password);
            setLoading(false); // Move setLoading(false) inside setTimeout callback
        }, 1000);
    };
    
    
    return (
        <div className="flex flex-col mt-20 justify-center items-center bg-gray-100">
            <div className="text-3xl mb-6 text-center font-bold">Log In</div>
            <div className="w-80 bg-white rounded-lg shadow-md p-6">
                <div className="mb-4 flex items-center border-b border-gray-300">
                    <MailIcon className="h-6 w-6 mr-3 text-gray-600" />
                    <input 
                        type="text"
                        name="email" 
                        placeholder="Email" 
                        onChange={changeHanlder}
                        className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none" 
                    />
                </div>
                <div className="mb-6 flex items-center border-b border-gray-300">
                    <LockClosedIcon className="h-6 w-6 mr-3 text-gray-600" />
                    <input 
                        type="password"
                        name="password" 
                        placeholder="Password"
                        onChange={changeHanlder}
                        className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none" 
                    />
                </div>
                <button 
                    type="submit"
                    onClick={submitHandler} 
                    className="w-full py-2 px-3 text-white rounded-lg bg-blue shadow-lg hover:bg-blue-600 focus:outline-none"
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
