export const apiConnector = async (method, url, bodyData, headers, params) => {
    try {
        const response = await fetch(url, {
            method: method,
            body: bodyData ? JSON.stringify(bodyData) : null,
            headers: { 'Content-Type': 'application/json', ...headers },
            params: params || null,
        });
        const data = await response.json();

        if (!response.ok) {
            console.error('API request failed:', data.error);
            throw new Error(data.error); // You can throw the error if needed for further handling
        }

        return { data, response: response };
    } catch (error) {
        console.error('Error in API request:', error);
        // You can handle the error here or re-throw it as needed
        throw error;
    }
};
