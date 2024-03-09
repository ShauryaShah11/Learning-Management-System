import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector.js";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/auth/login`,
            {
                email,
                password,
            }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Email or password is incorrect:", error);
        throw error;
    }
};

export const register = async (formData) => {
    try {
        const result = await apiConnector(
            "POST",
            `${API_URL}/auth/user-register`,
            formData
        );
        if (result.response.ok) {
            toast.success("Registration Successful");
        } else {
            throw new Error(result.data.error);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

export const tutorRegister = async (formData) => {
    try {
        const result = await apiConnector(
            "POST",
            `${API_URL}/auth/tutor-register`,
            formData
        );
        if (result.response.ok) {
            toast.success("Registration Successful");
        } else {
            throw new Error(result.data.error);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successful");
};
