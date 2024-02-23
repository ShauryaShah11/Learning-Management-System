import { apiConnector } from "./apiConnector";

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('token');
const BearerToken = `Bearer ${token}`;

export const fetchUserData = async () => {
    try {
        const {data, response} = await apiConnector('GET', `${API_URL}/users/current`, null, { 'Authorization': BearerToken });
        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }
        return data;

    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

export const createRazorPayOrder = async ({amount}) => {
    try{
        const {data, response} = await apiConnector('POST', `${API_URL}/payments/checkout`,{amount}, { 'Authorization': BearerToken });
        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }
        return data;
    }
    catch(error){
        console.error('Error creating razorpay order:', error);
        throw error;
    }
};

export const confirmRazorPayOrder = async (data) => {
    try{
        const {data, response} = await apiConnector('POST', `${API_URL}/payments/paymentverification`,{data}, { 'Authorization': BearerToken });
        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }
        return data;
    }
    catch(error){
        console.error('Error creating razorpay order:', error);
        throw error;
    }
};