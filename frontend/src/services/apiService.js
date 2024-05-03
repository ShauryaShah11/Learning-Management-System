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

export const fetchSearchCourses = async (searchCourse) => {
    try {
        const {data, response} = await apiConnector('GET',`${API_URL}/courses/search?query=${searchCourse}`);
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

export const fetchQuestions = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/questions/${id}`
        );
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);

        throw error;
    }
}

export const fetchReviews = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/reviews/${id}`
        );
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);

        throw error;
    }
}

export const fetchSection = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/sections/course/${id}`
        );
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);

        throw error;
    }
}

export const fetchSubSection = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/sections/${id}/subsections`
        );
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);

        throw error;
    }
}
export const fetchSectionById = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/sections/${id}`
        );
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);

        throw error;
    }
}

export const fetchSubSectionById = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/sections/subsection/${id}`
        );
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);

        throw error;
    }
}