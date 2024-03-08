import { apiConnector } from "./apiConnector";

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem("token");
export const fetchUserData = async () => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/users/current`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const createRazorPayOrder = async ({ amount }) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/payments/checkout`,
            { amount },
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error creating razorpay order:", error);
        throw error;
    }
};

export const confirmRazorPayOrder = async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseId,
}) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/payments/paymentverification`,
            {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                courseId,
            },
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error creating razorpay order:", error);
        throw error;
    }
};

export const fetchAllCourses = async () => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/courses/all`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const fetchTutorCourses = async () => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/courses/tutor/65a7f1889708ac7058a17faa`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const publishCourse = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/courses/publish/${id}`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const enrollInCourse = async (id) => {
    try {
        const { response } = await apiConnector(
            "POST",
            `${API_URL}/enrollments/${id}`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const fetchEnrolledUsers = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/enrollments/user/${id}`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const EditCourseData = async (id, formData) => {
    try {
        const { data, response } = await apiConnector(
            "PUT",
            `${API_URL}/courses/${id}`,
            formData,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const fetchMyCourses = async () => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/enrollments/mycourses`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const updateCatgeory = async (id, formData) => {
    try {
        const { data, response } = await apiConnector(
            "PUT",
            `${API_URL}/categories/${id}`,
            formData,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return response.ok;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const AddCourseData = async (formData) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/courses/add`,
            formData,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const fetchInstructors = async () => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/tutor`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}

export const fetchInstructorById = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/tutor/${id}`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}

export const updateInstructor = async (id, formData) => {
    try {
        const { data, response } = await apiConnector(
            "PUT",
            `${API_URL}/tutor/${id}`,
            formData,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}

export const fetchUsers = async () => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/users`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}

export const fetchUserById = async (id) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/users/${id}`,
            null,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}

export const updateUser = async (id, formData) => {
    try {
        const { data, response } = await apiConnector(
            "PUT",
            `${API_URL}/users/${id}`,
            formData,
            { Authorization: token }
        );
        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }
        return data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}