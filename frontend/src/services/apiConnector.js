export const apiConnector = async (method, url, bodyData, headers, params) => {
    try {
        const fetchOptions = {
            method: method,
            headers: { ...headers },
            params: params || null,
        };

        if (bodyData instanceof FormData) {
            fetchOptions.body = bodyData;
        } else {
            fetchOptions.body = bodyData ? JSON.stringify(bodyData) : null;
            fetchOptions.headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, fetchOptions);
        const data = await response.json();

        if (!response.ok) {
            console.error('API request failed:', data.error);
            throw new Error(data.error); // You can throw the error if needed for further handling
        }

        return { data, response };
    } catch (error) {
        console.error('Error in API request:', error);
        // You can handle the error here or re-throw it as needed
        throw error;
    }
};
