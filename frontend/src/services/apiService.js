import { toast } from "react-hot-toast"
import { apiConnector } from "./apiConnector";

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('token');
const BearerToken = `Bearer ${token}`;

export const fetchCourses = async () => {
    try {
        const response = await apiConnector('GET',`${API_URL}/courses`);
        if (response.status !== 200) {
            throw new Error(response.data.message);
        }
        console.log("response: " + response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const fetchCourse = async (id) => {
    try {
        const response = await apiConnector('GET',`${API_URL}/courses/${id}`);
        if(!response.data.ok){
          throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const fetchEnrollments = async () => {
    try {
        const response = await apiConnector('GET',`${API_URL}/enrollments`,{
          authorization: BearerToken
        });
        if(!response.data.ok){
          throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const enrollCourse = async (courseId) => {
    try {
        const response = await apiConnector('POST',`${API_URL}/enrollments`,{
          courseId
        });
        if(!response.data.ok){
          throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const fetchUser = async () => {
    try {
        const response = await apiConnector('GET',`${API_URL}/auth/user`);
        if(!response.data.ok){
          throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const fetchUserEnrollments = async () => {
    try {
        const response = await apiConnector('GET',`${API_URL}/auth/user/enrollments`);
        if(!response.data.ok){
          throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}