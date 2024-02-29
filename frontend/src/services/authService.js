import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector.js";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  try {
    const {data, response} = await apiConnector('POST', `${API_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      return data;
    }
    else{
      return { error: "Email or password is incorrect" };
    }
  } catch (error) {
      toast.error(error.message); 
      return { error: error.message };
  }
};

export const register = async ({username, firstName, lastName, email, password, age, contactNumber}) => {
    try {
      const parsedAge = Number.isNaN(parseInt(age)) ? 0 : parseInt(age);
      const result = await apiConnector('POST',`${API_URL}/auth/user-register`,{
        username,
        firstName,
        lastName,
        email,
        password,
        age: parsedAge,
        contactNumber
      });
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
  localStorage.removeItem('token');
  toast.success("Logout successful");
}