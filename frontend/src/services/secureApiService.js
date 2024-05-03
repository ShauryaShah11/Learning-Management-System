import { apiConnector } from "./apiConnector";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUserData = async (token) => {
    try {
        console.log("token in function", token);
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

export const createRazorPayOrder = async ({ amount, token }) => {
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
    token,
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

export const fetchAllCourses = async (token) => {
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

export const fetchTutorCourses = async (id, token) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/courses/tutor/${id}`,
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

export const toggleCourse = async (id, token) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/courses/toggle/${id}`,
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

export const enrollInCourse = async (id, token) => {
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

export const fetchEnrolledUsers = async (id, token) => {
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

export const EditCourseData = async (id, formData, token) => {
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

export const fetchMyCourses = async (token) => {
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

export const updateCategory = async (id, formData, token) => {
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

export const AddCourseData = async (formData, token) => {
    console.log(token);
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

export const fetchInstructors = async (token) => {
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
};

export const fetchInstructorById = async (id, token) => {
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
};

export const updateInstructor = async (id, formData, token) => {
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
};

export const fetchUsers = async (token) => {
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
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const fetchUserById = async (id, token) => {
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
};

export const updateUser = async (id, formData, token) => {
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
};

export const updateProfile = async (formData, token) => {
    try {
        console.log("hello")
        const { data, response } = await apiConnector(
            "PUT",
            `${API_URL}/users/current`,
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

export const addCategory = async (formData, token) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/categories/add`,
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

export const addQuestion = async ({ id, questionText, token }) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/questions/add/${id}`,
            { questionText },
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

export const addAnswer = async (id, { answerText }, token) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/answers/add/${id}`,
            { answerText },
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

export const addReview = async (id, { reviewText, rating }, token) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/reviews/add/${id}`,
            { reviewText, rating },
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

export const addSection = async (id, { title }, token) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/sections/add/${id}`,
            { title },
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

export const addSubSection = async (id, formData, token) => {
    try {
        const { data, response } = await apiConnector(
            "POST",
            `${API_URL}/sections/subsection/add/${id}`,
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

export const updateSection = async (id, { title }, token) => {
    try {
        const { data, response } = await apiConnector(
            "PUT",
            `${API_URL}/sections/update/${id}`,
            { title },
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

export const updateSubSection = async (id, formData, token) => {
    try {
        const { data, response } = await apiConnector(
            "PUT",
            `${API_URL}/sections/subsection/update/${id}`,
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

export const fetchCourseContent = async (id, token) => {
    try {
        const { data, response } = await apiConnector(
            "GET",
            `${API_URL}/courses/${id}/content`,
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

export const removeUser = async (id, token) => {
    try {
        const { data, response } = await apiConnector(
            "DELETE",
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
};

export const removeInstructor = async (id, token) => {
    try {
        const { data, response } = await apiConnector(
            "DELETE",
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
};

export const removeCategory = async (id, token) => {
    try {
        const { data, response } = await apiConnector(
            "DELETE",
            `${API_URL}/categories/${id}`,
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

export const removeCourse = async (id, token) => {
    try {
        const { data, response } = await apiConnector(
            "DELETE",
            `${API_URL}/courses/${id}`,
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