import { toast } from "react-hot-toast"
import { apiConnector } from "./apiConnector";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCourses = async () => {
    try {
        const {data, response} = await apiConnector('GET', `${API_URL}/courses`);
        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }
        return data.course;

    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

export const fetchCourse = async (id) => {
    try {
        const {data, response} = await apiConnector('GET',`${API_URL}/courses/${id}`);
        if(!response.ok){
            throw new Error('Request failed with status ' + response.status);
        }
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const fetchCategories = async () => {
    try{
        const { data, response } = await apiConnector('GET',`${API_URL}/categories`);
        if(!response.ok){
          throw new Error(data.message);
        }
        return data;
    }
    catch(error) {
        toast.error(error.message);

        throw error;
    }
}

export const fetchCategory = async (id) => {
    try{
        const { data, response} = await apiConnector('GET',`${API_URL}/categories/${id}`);
        if(!response.ok){
          throw new Error(data.message);
        }
        return data;
    }
    catch(error) {
        toast.error(error.message);

        throw error;
    }
}

export const fetchCategoryWithCoursesData = async (id) => {
    try{
        const { data, response} = await apiConnector('GET',`${API_URL}/categories/getCourses/${id}`);
        if(!response.ok){
          throw new Error(data.message);
        }
        return data;
    }
    catch(error) {
        toast.error(error.message);

        throw error;
    }
}

export const fetchCourseByTutorId = async (id) => {
    try {
        const {data, response} = await apiConnector('GET',`${API_URL}/courses/tutor/${id}`);
        if(!response.ok){
            throw new Error('Request failed with status ' + response.status);
        }
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const getRazorPayApi = async () => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/razorpay-key`
        );
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data.key;
    } catch (error) {
        console.error("Error creating razorpay order:", error);

        throw error;
    }
};
