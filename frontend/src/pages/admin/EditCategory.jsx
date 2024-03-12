import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCategory } from "../../services/apiService";
import toast from "react-hot-toast";
import { updateCategory } from "../../services/secureApiService";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../store/atoms/token";

const EditCategoryForm = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [formData, setFormData] = useState({
        categoryName: "",
        description: "",
    });
    const [token, setToken] = useRecoilState(tokenAtom);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await fetchCategory(id);
                setCategory(response);
                setFormData({
                    categoryName: response.categoryName,
                    description: response.description,
                });
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };
        fetchCategoryData();
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            setToken(token);
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCategory(id, formData, token);
            toast.success("Category updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error updating category");
        }
    };

    const handleCancel = () => {
        // Handle cancellation logic if needed
    };

    return (
        <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mb-4">
            <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
            <div className="mb-4">
                <label
                    htmlFor="categoryName"
                    className="block text-sm font-semibold mb-2"
                >
                    Category Name
                </label>
                <input
                    type="text"
                    id="categoryName"
                    name="categoryName" // Corrected the name attribute
                    value={formData.categoryName}
                    onChange={handleChange}
                    className="w-full border py-2 px-3 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter category name"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="description"
                    className="block text-sm font-semibold mb-2"
                >
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter category description"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
                >
                    Update
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditCategoryForm;
