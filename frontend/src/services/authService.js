import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector.js";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
    try {
      const result = await apiConnector('POST', `${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (result.response.ok) {
        localStorage.setItem("token", result.data.token);
        toast.success("Login successful");
      }
      else{
        toast.error("Email or password is incorrect");
      }
    } catch (error) {
        toast.error(error.message); 
    }
};


// analuze below code for a moment
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
